import React from 'react';
import Field from '../../src/Field';
import TestUtils from 'react/lib/ReactTestUtils';
import Immutable from 'immutable';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from '../../src/constants';
import update from 'react/lib/update';
import fixture from '../fixtures/field-text.json';
import prepopVisibilityFixture from '../fixtures/field-prepopulate-visibility.json';
import prepopConcatFixture from '../fixtures/field-prepopulate-concat.json';

describe('Field component', () => {

  it('can manage viewable state', () => {
    let config = update(fixture, {
      value: { $set: 'foo' },
      dependencyName: { $set: 'testfield' },
      dependencyValue: {$set: 'bar'},
      initialState: {$set: 'hidden'}
    });
    let comp = TestUtils.renderIntoDocument(<Field {...config}/>);
    let dom = comp.getDOMNode();
    expect(/hidden/.test(dom.className)).toEqual(true);
  });

  it('can render error messages', (done) => {
    let comp = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let eventData = {
      id: fixture.id,
      hasError: true,
      errorMessage: 'It broke.'
    };
    Flux.doAction(constants.actions.FIELD_VALIDATION_ERROR, eventData)
      .then(() => {
        let helpBlock = TestUtils.findRenderedDOMComponentWithClass(comp, 'help-block');
        expect(helpBlock.getDOMNode().textContent).toEqual('It broke.');
        expect(/error/.test(comp.getDOMNode().className)).toEqual(true);
        done();
      });
  });

  it('can render a FieldGroup', () => {
    var config = require('../fixtures/field-group.json').config;
    var comp = TestUtils.renderIntoDocument(<Field {...config}/>);
    var lgnd = TestUtils.findRenderedDOMComponentWithTag(comp, 'legend');
    var inpts = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    expect(comp.getDOMNode().tagName.toLowerCase()).toEqual('fieldset');
    expect(lgnd.getDOMNode().textContent).toEqual(config.label);
    expect(inpts.length).toEqual(3);
  });

  it('can set field value properly', () => {
    let config = Immutable.fromJS({
      config: {
        id: 'testText',
        type: 'text',
        name: 'testText',
        label: 'Test Text'
      }
    });
    let model = Immutable.fromJS({testText: 'my test value'});
    let result = Field.configure(config,model, Immutable.fromJS({}));
    expect(result.value).toEqual(model.get('testText'));
  });

  it('can determine a field\'s visibility based on a field value dependency from a previous pages', () => {
    let schema = Immutable.fromJS(prepopVisibilityFixture);
    let model = Immutable.fromJS({usingDba: 'no'});
    let field = Field.configure(schema, model, Immutable.fromJS({}));
    expect(field.initialState).toEqual('hidden');
  });

  it('can set a field\'s value to equal the concatonation of multiple fields from previous pages', () => {
    let schema = Immutable.fromJS(prepopConcatFixture);
    let model = Immutable.fromJS({
      title: 'Mr.',
      nameFirst: 'John',
      nameMiddle: 'L.',
      nameLast: 'Doe',
      suffix: 'Jr.'
    });
    let field = Field.configure(schema, model, Immutable.fromJS({}));
    expect(field.value).toEqual('Mr. John L. Doe Jr.');
  });

});
