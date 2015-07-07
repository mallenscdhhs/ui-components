import _ from 'lodash';
import constants from '../../src/constants';
import Select from '../../src/Select';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import fixture from '../fixtures/options';
import OptionsStore from '../../src/OptionsStore';
import Components from '../../src/main';

let {
  LOAD_OPTIONS,
  SEND_OPTIONS,
  SEND_RESOURCE_OPTIONS,
  FIELD_VALUE_CHANGE,
  ENTRYLIST_FIELD_VALUE_CHANGE
} = constants.actions;

describe('OptionsMixin', () => {

  beforeEach(() => {
    Components.configure({
      API: {
        options: '/api/resource'
      }
    });
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  it('can load options from props', () => {
    let config = fixture.fieldWithOptions;
    let component = TestUtils.renderIntoDocument(<Select {...config}/>);
    expect(component.state.options.length).toEqual(1);
    expect(component.state.options[0].value).toEqual(config.options[0].value);
  });

  it('can request options from API', (done) => {
    let field = fixture.fieldWithOptionsResource;
    let response = fixture.fieldWithOptionsResourceResponse;
    let resourceName = field.optionsResource;
    let handlerId = Dispatcher.register((action, data) => {
      if (action === LOAD_OPTIONS && data.id === field.id) {
        Dispatcher.unregister(handlerId);
        let result = response.responseData.responsePayload.result[0];
        expect(data.id).toEqual(field.id);
        expect(data.options[0].label).toEqual(result.label);
        expect(data.options[0].value).toEqual(result.value);
        done();
      }
    });

    jasmine.Ajax
      .stubRequest(`/api/resource/${resourceName}`)
      .andReturn(fixture.fieldWithOptionsResourceResponse);

    TestUtils.renderIntoDocument(<Select {...field}/>);
  });

  it('can request custom options to be loaded', (done) => {
    let handlerId = Dispatcher.register((action, items) => {
      if (action === LOAD_OPTIONS) {
        Dispatcher.unregister(handlerId);
        expect(items[0].value).toEqual(fixture.customPayload[0].value);
        expect(items[0].label).toEqual(fixture.customPayload[0].label);
        done();
      }
    });

    let handler2Id = Dispatcher.register((action, data) => {
      if (action === SEND_OPTIONS) {
        expect(data.id).toEqual(fixture.customField.id);
        Dispatcher.dispatch(LOAD_OPTIONS, fixture.customPayload);
        Dispatcher.unregister(handler2Id);
      }
    });

    TestUtils.renderIntoDocument(<Select {...fixture.customField}/>);
  });

  it('can load options based on a dependent field value', (done) => {
    let field = fixture.fieldWithDependency;
    let dependency = field.optionsDependencyName[0];
    let filter = JSON.stringify({[dependency]: fixture.dependentField1.value});
    let filterParam = encodeURIComponent(filter);
    let resourceName = field.optionsResource;
    let stubUrl = `/api/resource/${resourceName}?filter=${filterParam}`;
    let handler = Dispatcher.register((action, data) => {
      if (action === LOAD_OPTIONS) {
        Dispatcher.unregister(handler);
        let result = fixture.fieldWithDependencyResponse.responseData.responsePayload.result;
        expect(data.options.length).toEqual(result.length);
        done();
      }
    });

    jasmine.Ajax
      .stubRequest(stubUrl)
      .andReturn(fixture.fieldWithDependencyResponse);

    TestUtils.renderIntoDocument(<Select {...field}/>);
    Dispatcher.dispatch(FIELD_VALUE_CHANGE, fixture.dependentField1);
  });

  it('can load options from a dependent field that is part of an EntryListForm', (done) => {
    let field = fixture.fieldWithDependency;
    let dependency = field.optionsDependencyName[0];
    let filter = JSON.stringify({[dependency]: fixture.dependentField1.value});
    let filterParam = encodeURIComponent(filter);
    let resourceName = field.optionsResource;
    let stubUrl = `/api/resource/${resourceName}?filter=${filterParam}`;
    let handler = Dispatcher.register((action, data) => {
      if (action === LOAD_OPTIONS) {
        Dispatcher.unregister(handler);
        let result = fixture.fieldWithDependencyResponse.responseData.responsePayload.result;
        expect(data.options.length).toEqual(result.length);
        done();
      }
    });

    jasmine.Ajax
      .stubRequest(stubUrl)
      .andReturn(fixture.fieldWithDependencyResponse);

    TestUtils.renderIntoDocument(<Select {...field}/>);
    Dispatcher.dispatch(ENTRYLIST_FIELD_VALUE_CHANGE, fixture.dependentField1);
  });

  it('can load options based on multiple dependent field values', (done) => {
    let field = fixture.fieldWithMultipleDependencies;
    let dependency1 = fixture.dependentField1;
    let dependency2 = fixture.dependentField2;
    let handler1 = Dispatcher.register((action, data) => {
      if (action === SEND_RESOURCE_OPTIONS && data.resourceFilter) {
        let filter = JSON.parse(data.resourceFilter);
        let numFilters = Object.keys(filter).length;
        if (numFilters > 1) {
          Dispatcher.unregister(handler1);
          expect(numFilters).toEqual(2);
          expect(filter[dependency1.name]).toEqual(dependency1.value);
          expect(filter[dependency2.name]).toEqual(dependency2.value);
          done();
        } else {
          expect(numFilters).toEqual(1);
          expect(filter[dependency1.name]).toEqual(dependency1.value);
        }
      }
    });

    TestUtils.renderIntoDocument(<Select {...field}/>);

    Dispatcher.dispatch(FIELD_VALUE_CHANGE, dependency1).then(() => {
      Dispatcher.dispatch(FIELD_VALUE_CHANGE, dependency2);
    });
  });
});
