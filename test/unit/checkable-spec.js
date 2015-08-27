import React from 'react';
import fixture from '../fixtures/radio.json';
import checkboxFixture from '../fixtures/field-checkbox.json';
import Checkable from '../../src/Checkable';
import TestUtils from 'react/lib/ReactTestUtils';
import update from 'react/lib/update';
import {dispatcher as Dispatcher} from 'fluxify';
import constants from '../../src/constants';

let {
  FIELD_VALUE_CHANGE,
  FIELD_GROUP_VALUE_CHANGE
} = constants.actions;

describe('Checkable', () => {

  it('can render a single radio input', () => {
    let dom = TestUtils.renderIntoDocument(<Checkable {...fixture.config}/>);
    let wrapperDiv = dom.getDOMNode();
    let label = wrapperDiv.childNodes[0];
    let input = label.childNodes[0];
    expect(wrapperDiv.className).toEqual('radio-inline');
    expect(label.getAttribute('for')).toEqual(fixture.config.id);
    expect(input.type).toEqual(fixture.config.type);
    expect(input.value).toEqual(fixture.config.value);
    expect(input.name).toEqual(fixture.config.name);
    expect(input.checked).toBe(false);
  });

  it('can render a single checkbox input and return boolean FIELD_VALUE_CHANGE values upon checking', (done) => {
    Dispatcher.register('CHECKABLE-TEST-0', (action, data) => {
      if (action === FIELD_VALUE_CHANGE && data.id === checkboxFixture.id) {
        Dispatcher.unregister('CHECKABLE-TEST-0');
        expect(data.value).toBe(true);
        done();
      }
    });

    let dom = TestUtils.renderIntoDocument(<Checkable {...checkboxFixture}/>);
    let wrapperDiv = dom.getDOMNode();
    let label = wrapperDiv.childNodes[0];
    let input = label.childNodes[0];
    expect(wrapperDiv.className).toEqual('checkbox-inline');
    expect(label.getAttribute('for')).toEqual(checkboxFixture.id);
    expect(input.type).toEqual(checkboxFixture.type);
    expect(input.name).toEqual(checkboxFixture.name);
    input.checked = true;
    TestUtils.Simulate.change(input);
  });

  it('can render a required radio input', () => {
    let config = update(fixture.config, {required: {$set: true}});
    let dom = TestUtils.renderIntoDocument(<Checkable {...config}/>);
    let label = dom.getDOMNode().childNodes[0];
    expect(label.childNodes[1].textContent).toEqual(fixture.config.label);
    expect(label.childNodes[2].textContent).toEqual('*');
  });

  it('can render a checked radio input', () => {
    let config = update(fixture.config, {checked: {$set: true}});
    let dom = TestUtils.renderIntoDocument(<Checkable {...config}/>);
    let input = dom.getDOMNode().childNodes[0].childNodes[0];
    expect(input.checked).toBe(true);
  });

  it('can publish a radio input value on change', (done) => {
    Dispatcher.register('CHECKABLE-TEST-1', (action, data) => {
      if (action === FIELD_VALUE_CHANGE && data.id === fixture.config.id) {
        Dispatcher.unregister('CHECKABLE-TEST-1');
        expect(data.id).toEqual(fixture.config.id);
        expect(data.name).toEqual(fixture.config.name);
        expect(data.value).toBe(fixture.config.value);
        done();
      }
    });
    let comp = TestUtils.renderIntoDocument(<Checkable {...fixture.config}/>);
    let radio = comp.getDOMNode().childNodes[0].childNodes[0];
    TestUtils.Simulate.change(radio, {target: {checked: true}});
  });

  it('will publish a value of "null" if input is not checked', (done) => {
    Dispatcher.register('CHECKABLE-TEST-2', (action, data) => {
      if (action === FIELD_VALUE_CHANGE && data.id === fixture.config.id) {
        Dispatcher.unregister('CHECKABLE-TEST-2');
        expect(data.id).toEqual(fixture.config.id);
        expect(data.name).toEqual(fixture.config.name);
        expect(data.value).toBe(null);
        done();
      }
    });
    let comp = TestUtils.renderIntoDocument(<Checkable {...fixture.config}/>);
    let radio = comp.getDOMNode().childNodes[0].childNodes[0];
    TestUtils.Simulate.change(radio, {target: {checked: false}});
  });

  it('will publish a "fieldGroup:item:change" event if input is part of a group', (done) => {
    Dispatcher.register('CHECKABLE-TEST-3', (action, data) => {
      if (action === FIELD_GROUP_VALUE_CHANGE && data.id === fixture.config.id) {
        Dispatcher.unregister('CHECKABLE-TEST-3');
        expect(data.id).toEqual(fixture.config.id);
        expect(data.name).toEqual(fixture.config.name);
        expect(data.value).toBe(null);
        done();
      }
    });
    let config = update(fixture.config, {isFieldGroup: {$set: true}, parent: {$set: 'parent123'}});
    let comp = TestUtils.renderIntoDocument(<Checkable {...config}/>);
    let radio = comp.getDOMNode().childNodes[0].childNodes[0];
    TestUtils.Simulate.change(radio, {target: {checked: false}});
  });

});
