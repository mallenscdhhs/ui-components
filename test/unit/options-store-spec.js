import { dispatcher as Dispatcher } from 'fluxify';
import constants from '../../src/constants';
import fixture from '../fixtures/options';
import Components from '../../src/main';
import OptionsStore from '../../src/OptionsStore';

let {
  LOAD_OPTIONS,
  SEND_RESOURCE_OPTIONS
} = constants.actions;

describe('OptionsStore', () => {
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

  it('can load options from API', (done) => {
    let field = fixture.fieldWithOptionsResource;
    let fieldId = field.id;
    let resourceName = field.optionsResource;
    let actionPayload = {fieldId, resourceName};
    let handler = Dispatcher.register((action, data) => {
      if (action === LOAD_OPTIONS && data.id === fieldId) {
        Dispatcher.unregister(handler);
        expect(data.options.length).toBe(3);
        done();
      }
    });

    jasmine.Ajax
      .stubRequest(`/api/resource/${resourceName}`)
      .andReturn(fixture.fieldWithOptionsResourceResponse);

    Dispatcher.dispatch(SEND_RESOURCE_OPTIONS, actionPayload);
  });

  it('can filter options', (done) => {
    let field = fixture.fieldWithDependency;
    let resourceName = field.optionsResource;
    let fieldId = field.id;
    let filterName = fixture.dependentField1.name;
    let filterValue = fixture.dependentField1.value;
    let resourceFilter = JSON.stringify({[filterName]: filterValue});
    let actionPayload = {fieldId, resourceName, resourceFilter};
    let filterParam = encodeURIComponent(resourceFilter);
    let handler1 = Dispatcher.register((action, data) => {
      if (action === LOAD_OPTIONS && data.id === fieldId) {
        Dispatcher.unregister(handler1);
        expect(data.options.length).toBe(1);
        expect(data.options[0].label).toBe('One');
        done();
      }
    });

    jasmine.Ajax
      .stubRequest(`/api/resource/${resourceName}?filter=${filterParam}`)
      .andReturn(fixture.fieldWithDependencyResponse);

    Dispatcher.dispatch(SEND_RESOURCE_OPTIONS, actionPayload);
  });
});
