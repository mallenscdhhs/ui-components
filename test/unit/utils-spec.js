import React from 'react';
import Immutable from 'immutable';
import TestUtils from 'react/lib/ReactTestUtils';
import utils from '../../src/utils';
import Field from '../../src/Field';
import prepopVisibilityFixture from '../fixtures/field-prepopulate-visibility.json';
import prepopConcatFixture from '../fixtures/field-prepopulate-concat.json';

describe('utils', () => {
  describe('#containsOneOf', () => {
    it('will return "true" if a list contains a value from another list', () => {
      expect(utils.containsOneOf([1, 2, 3, 4], [0, 1])).toEqual(true);
      expect(utils.containsOneOf(['a', 'b', 'c'], ['AA', 'B', 'c'])).toEqual(true);
      expect(utils.containsOneOf(['1', '2'], ['1', '2'])).toEqual(true);
    });
    it('will return "false" if a list does not contain a value from another list', () => {
      expect(utils.containsOneOf([1, 2, 3], [0, 4])).toEqual(false);
      expect(utils.containsOneOf(['a', 'b', 'c'], ['A', 'bee'])).toEqual(false);
    });
  });

  describe('#getClasses', () => {
    let classesConfig = {
      type: 'button',
      classNames: ['btn', 'btn-primary', 'create-item-button'],
      disabled: false
    };

    it('will return custom classes from an array of strings in props.classNames', () => {
      expect(utils.getClasses(classesConfig)).toEqual('btn btn-primary create-item-button');
    });
    it('will return the disabled class if props.disabled is truthy', () => {
      classesConfig.disabled = true;
      expect(utils.getClasses(classesConfig)).toEqual('btn btn-primary create-item-button disabled');
    });
    it('will return the link class if props.type is link', () => {
      classesConfig = {type: 'link', classNames: ['create-item-link']};
      expect(utils.getClasses(classesConfig)).toEqual('create-item-link link');
    });
  });

  describe('#getComputedInputAttr', () => {
    let fieldConfig = {
      id: 'first-name',
      name: 'first-name',
      label: 'First Name',
      type: 'input'
    };
    let dom = TestUtils.renderIntoDocument(<Field {...fieldConfig} {...utils.getComputedInputAttr('first-name')} />);
    let wrapperDiv = dom.getDOMNode();
    let input = wrapperDiv.childNodes[1];
    let helpBlock = wrapperDiv.childNodes[2];

    it('assigns form-control className', () => {
      expect(input.className).toEqual('form-control');
    });
    it('accepts the fieldId as an argument and assigns the proper aria-describedby attr to correspond with the help-block that follows the input', () => {
      expect(input.getAttribute('aria-describedby')).toEqual('first-name-help-block');
      expect(helpBlock.id).toEqual('first-name-help-block');
    });
  });

  describe('#getDependentVisibility', () => {
    let schema = Immutable.fromJS(prepopVisibilityFixture);
    let config = schema.get('config');
    let model = Immutable.fromJS({usingDba: 'no'});
    let opConfig = config.get('appInputOperationConfig');
    let action = opConfig.get('action');
    let result = utils[action](config, model, opConfig);

    it('returns the config object passed in and sets its\' initialState to hidden if the dependencyName and dependencyValue match the model value for that corresponding field', () => {
      expect(result.get('initialState')).toEqual('hidden');
    });
  });

  describe('#composeFromFields', () => {
    let schema = Immutable.fromJS(prepopConcatFixture);
    let config = schema.get('config');
    let opConfig = config.get('appInputOperationConfig');
    let action = opConfig.get('action');
    let model = Immutable.fromJS({
      title: 'Mr.',
      nameFirst: 'John',
      nameMiddle: 'L.',
      nameLast: 'Doe',
      suffix: 'Jr.'
    });
    let result = utils[action](config, model, opConfig);

    it('returns a string equal the concatonation of all fields passed in via the model that match the opConfig.fieldsArray object ids', () => {
      let fieldId = config.get('id');
      expect(result.get(fieldId)).toEqual('Mr. John L. Doe Jr.');
    });
  });

});
