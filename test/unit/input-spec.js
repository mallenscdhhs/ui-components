import React from 'react';
import update from 'react/lib/update';
import Flux, {dispatcher as Dispatcher} from 'fluxify';
import constants from '../../src/constants';
import Input from '../../src/Input';
import fixture from '../fixtures/field-text.json';
import TestUtils from 'react/lib/ReactTestUtils';
import _ from 'lodash';
import Immutable from 'immutable';

let fixtureMap = Immutable.Map(fixture);
let {FIELD_VALUE_CHANGE} = constants.actions;

describe('Input', () => {

  it('can render a text input', () => {
    var comp = TestUtils.renderIntoDocument(<Input {...fixture}/>);
    var dom = comp.getDOMNode();
    expect(dom.tagName.toLowerCase()).toEqual('input');
    expect(dom.type).toEqual(fixture.type);
    expect(dom.name).toEqual(fixture.name);
    expect(dom.id).toEqual(fixture.id);
    expect(dom.getAttribute('disabled')).toBeNull();
  });

  it('can render a disabled text input', () => {
    var config = update(fixture, {disabled: {$set: true}});
    var comp = TestUtils.renderIntoDocument(<Input {...config}/>);
    var dom = comp.getDOMNode();
    expect(dom.getAttribute('disabled')).toBeDefined();
  });

  it('can mask an input field', (done) => {
    let config = fixtureMap
      .set('id', 'partial-mask-test')
      .set('mask', 'ssn')
      .set('value', '12345');
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();

    // should mask the initial value
    expect(dom.value).toEqual('***-**-');

    // should save the unmasked value
    comp.shouldComponentUpdate = function(nextProps, nextState) {
      expect(nextState.value).toBe('123456');
      return true;
    };

    // should mask new values
    comp.componentDidUpdate = function(props, state) {
      expect(dom.value).toBe('***-**-6');
      done();
    };

    comp.handleInputChange({target: {value: '***-**-6'}});
  });

  it('can mask pasted input values', (done) => {
    let config = fixtureMap
      .set('id', 'paste-mask-test')
      .set('mask', 'ssn');
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();
    let mockValue = '123456789';
    let mockEvent = {
      clipboardData: {
        getData: key => mockValue
      },
      preventDefault: () => false
    };

    expect(dom.value).toEqual('');

    comp.shouldComponentUpdate = function(props, state) {
      expect(state.value).toBe(mockValue);
      return true;
    };

    comp.componentDidUpdate = function(props, state) {
      expect(dom.value).toBe('***-**-6789');
      done();
    };

    comp.handlePaste(mockEvent);
  });

  it('can force manual input', () => {
    let config = fixtureMap.set('forceManualInput', true);
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();
    // verify that autocomplete attribute (along with the other internal helper props that don't render in the dom) is added to the input
    expect(dom.getAttribute('autocomplete')).toEqual('off');
  });

  it('will enforce a max length', (done) => {
    let config = fixtureMap
      .set('max', 9)
      .set('min', 9)
      .set('value', '12345678');
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();

    comp.componentDidUpdate = function(props, state) {
      expect(dom.value).toBe('123456789');
      done();
    };

    comp.handleInputChange({target: {value: '1234567890'}});
  });

  it('will enforce a max length on masked inputs', (done) => {
    let config = fixtureMap
      .set('min', 10)
      .set('max', 10)
      .set('mask', 'phone');
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();
    let mockEvent = {
      clipboardData: {
        getData: key => '12345678901234'
      },
      preventDefault: () => false
    };

    comp.componentDidUpdate = function(props, state) {
      expect(dom.value).toBe('123-456-7890');
      done();
    };

    comp.handlePaste(mockEvent);
  });
});
