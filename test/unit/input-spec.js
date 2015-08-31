import React from 'react';
import Immutable from 'immutable';
import Flux, {dispatcher as Dispatcher} from 'fluxify';
import constants from '../../src/constants';
import Input from '../../src/Input';
import fixture from '../fixtures/field-text.json';
import TestUtils from 'react/lib/ReactTestUtils';
import _ from 'lodash';

let {
  FIELD_VALUE_CHANGE
} = constants.actions;

let fixtureMap = Immutable.Map(fixture);

describe('Input', () => {

  it('can render a text input', () => {
    let comp = TestUtils.renderIntoDocument(<Input {...fixture}/>);
    let dom = comp.getDOMNode();
    expect(dom.tagName.toLowerCase()).toEqual('input');
    expect(dom.type).toEqual(fixture.type);
    expect(dom.name).toEqual(fixture.name);
    expect(dom.id).toEqual(fixture.id);
    expect(dom.getAttribute('disabled')).toBeNull();
  });

  it('can render a disabled text input', () => {
    let config = fixtureMap.set('disabled', true);
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();
    expect(dom.getAttribute('disabled')).toBeDefined();
  });

  it('can enforce max length', (done) => {
    let max = 10;
    let config = fixtureMap.set('max', max).set('value', '1234567890');
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();
    let handler = Dispatcher.register((action, data) => {
      if (action === FIELD_VALUE_CHANGE && data.id === fixture.id) {
        Dispatcher.unregister(handler);
        expect(data.value.length).toEqual(max);
        done();
      }
    });

    TestUtils.Simulate.change(dom, {target: {value: '12345678901111'}});
  });

  it('can partially mask an input field', (done) => {
    let mask = '000-00-XXXX';
    let config = fixtureMap.set('id', 'test-ssn').set('mask', mask);
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    var dom = comp.getDOMNode();
    var numCount = 0;
    // simulate entering a single character at a time
    setTimeout(() => {
      // initial value change
      TestUtils.Simulate.change(dom, {target: {value: '0'}});
    }, 100);

    // listen for FIELD_VALUE_CHANGE and test final value and unmasked value
    Dispatcher.register('test-ssn-change', (action, data) => {
      if (action === FIELD_VALUE_CHANGE && data.id === 'test-ssn') {
        if (data.value === '012345678') {
          Dispatcher.unregister('test-ssn-change');
          expect(data.masked).toEqual('***-**-5678');
          expect(data.value).toEqual('012345678');
          done();
        } else {
          numCount++;
          TestUtils.Simulate.change(dom, {target: {value: dom.value + numCount.toString()}});
        }
      }
    });
  });

  it('can support masking pasted input values', (done) => {
    let config = fixtureMap.set('id', 'test-date').set('mask', '00/00/XXXX');
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();
    let date = '01011979';
    // simulate pasting a full length string
    setTimeout(function() {
      // initial value change
      TestUtils.Simulate.change(dom, {target: {value: date}, pasted: date});
    }, 100);

    // listen for FIELD_VALUE_CHANGE and test final value and unmasked value
    Dispatcher.register('test-date-change', (action, data) => {
      if (action === FIELD_VALUE_CHANGE && data.id === 'test-date') {
        Dispatcher.unregister('test-date-change');
        expect(data.masked).toEqual('**/**/1979');
        expect(data.value).toEqual(date);
        done();
      }
    });
  });

  it('can support masking default input values', () => {
    // rendering the component with prepopulated value works as expected
    let date = '01011979';
    let config = fixtureMap.set('value', date);
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();
    expect(dom.value).toEqual(date);

    // add a mask to config and render the component, value is masked
    let configWithMask = config.set('mask', '00/00/XXXX');
    let compWithMask = TestUtils.renderIntoDocument(<Input {...configWithMask.toJS()}/>);
    let domWithMask = compWithMask.getDOMNode();
    expect(domWithMask.value).toEqual('**/**/1979');
  });

  it('can support suppyling a custom MaskSymbol', (done) => {
    let config = fixtureMap
      .set('id', 'test-cc')
      .set('mask', '0000 0000 0000 XXXX')
      .set('maskSymbol', '$');
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();
    let ccNum = '0101010101010101';

    // listen for FIELD_VALUE_CHANGE and test final value and unmasked value
    Dispatcher.register('test-cc-change', (action, data) => {
      if (action === FIELD_VALUE_CHANGE && data.id === config.get('id')) {
        Dispatcher.unregister('test-cc-change');
        expect(data.masked).toEqual('$$$$ $$$$ $$$$ 0101');
        expect(data.value).toEqual(ccNum);
        done();
      }
    });

    TestUtils.Simulate.change(dom, {target: {value: ccNum}, pasted: ccNum});
  });

  it('can force manual input', () => {
    let config = fixtureMap.set('forceManualInput', true);
    let comp = TestUtils.renderIntoDocument(<Input {...config.toJS()}/>);
    let dom = comp.getDOMNode();
    // verify that autocomplete attribute (along with the other internal helper props that don't render in the dom) is added to the input
    expect(dom.getAttribute('autocomplete')).toEqual('off');
  });

});
