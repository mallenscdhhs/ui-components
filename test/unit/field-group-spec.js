import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import Field from '../../src/Field';
import FieldGroup from '../../src/FieldGroup';
import { config as fixture } from '../fixtures/field-group.json';
import { dispatcher as Dispatcher } from 'fluxify';
import constants from '../../src/constants';
import Immutable from 'immutable';

let {
  FIELD_VALUE_CHANGE,
  GET_SESSION_VALUES
} = constants.actions;

describe('FieldGroup', () => {

  it('can render a list of checkboxes', () => {
    let comp = TestUtils.renderIntoDocument(<FieldGroup {...fixture}/>);
    let checkboxes = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    expect(checkboxes.length).toEqual(fixture.options.length);
    expect(checkboxes[0].getDOMNode().type).toEqual('checkbox');
    expect(checkboxes[0].getDOMNode().value).toEqual(fixture.options[0].value);
  });

  it('can render a list of radio inputs', () => {
    let config = Immutable.fromJS(fixture).set('type', 'radio').toJSON();
    let comp = TestUtils.renderIntoDocument(<FieldGroup {...config}/>);
    let checkboxes = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    expect(checkboxes.length).toEqual(fixture.options.length);
    expect(checkboxes[0].getDOMNode().type).toEqual('radio');
    expect(checkboxes[0].getDOMNode().value).toEqual(fixture.options[0].value);
  });

  it('can manage a list of values for checkboxes', (done) => {
    let comp = TestUtils.renderIntoDocument(<FieldGroup {...fixture}/>);
    let dom = comp.getDOMNode();
    let checkboxes = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    let numChanges = 0;
    expect(comp.state.value).toEqual([]);
    Dispatcher.register('FIELD-GROUP-TEST-1', (action, data) => {
      if (action === FIELD_VALUE_CHANGE && data.name === fixture.name) {
        numChanges += 1;
        if ( numChanges === 2 && data.id === fixture.id ) {
          Dispatcher.unregister('FIELD-GROUP-TEST-1');
          expect(data.value.join(',')).toEqual('1,2');
          done();
        }
      }
    });

    TestUtils.Simulate.change(checkboxes[0].getDOMNode(), {target: {checked: true}});
    TestUtils.Simulate.change(checkboxes[1].getDOMNode(), {target: {checked: true}});
  });

  it('can manage a single value for radios', (done) => {
    let config = Immutable.fromJS(fixture).set('type', 'radio').toJSON();
    let comp = TestUtils.renderIntoDocument(<FieldGroup {...config}/>);
    let dom = comp.getDOMNode();
    let radios = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    let numChanges = 0;
    expect(comp.state.value).toEqual('');
    Dispatcher.register('FIELD-GROUP-TEST-2', (action, data) => {
      if (action === FIELD_VALUE_CHANGE && data.name === fixture.name) {
        numChanges += 1;
        expect(data.value).toEqual(numChanges.toString());
        if (numChanges === 2) {
          Dispatcher.unregister('FIELD-GROUP-TEST-2');
          done();
        }
      }
    });

    TestUtils.Simulate.change(radios[0].getDOMNode(), {target: {checked: true}});
    setTimeout(() => {
      TestUtils.Simulate.change(radios[1].getDOMNode(), {target: {checked: true}});
    }, 200);
  });

  it('will run validation on blur', (done) => {
    let config = {
      type: 'radio',
      id: 'foo',
      name: 'foo',
      required: true,
      rules: {
        '/VR_InputRequiredCheck': true
      },
      options: [
        {label: 'One', value: 1},
        {label: 'Two', value: 2}
      ]
    };

    let field = TestUtils.renderIntoDocument(<Field {...config}/>);
    let radios = TestUtils.scryRenderedDOMComponentsWithTag(field, 'input');
    let input = radios[0].getDOMNode();
    let handler = Dispatcher.register((action, data) => {
      if (action === GET_SESSION_VALUES && data.id === config.id) {
        Dispatcher.unregister(handler);
        expect(data.name).toEqual(config.name);
        done();
      }
    });

    TestUtils.Simulate.focus(input, {});
    TestUtils.Simulate.blur(input, {});
  });
});
