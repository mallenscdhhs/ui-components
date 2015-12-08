import React from 'react';
import Immutable from 'immutable';
import TestUtils from 'react-addons-test-utils';
import utils from '../../src/utils';
import Field from '../../src/Field';
import prepopVisibilityFixture from '../fixtures/field-prepopulate-visibility.json';
import prepopConcatFixture from '../fixtures/field-prepopulate-concat.json';

describe('utils', () => {
  
  describe('#getDependentVisibility', () => {
    let schema = Immutable.fromJS(prepopVisibilityFixture);
    let config = schema.get('config');
    let model = Immutable.fromJS({usingDba: 'no'});
    let opConfig = config.get('inputOperationConfig');
    let action = opConfig.get('action');
    let result = utils[action](config, model, opConfig);

    it('returns the config object passed in and sets its\' initialState to hidden if the dependencyName and dependencyValue match the model value for that corresponding field', () => {
      expect(result.get('initialState')).toEqual('hidden');
    });
  });

  describe('#composeFromFields', () => {
    let schema = Immutable.fromJS(prepopConcatFixture);
    let config = schema.get('config');
    let opConfig = config.get('inputOperationConfig');
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

  describe('#getDateString', () => {
    let result = utils.getDateString('2015-08-11T17:27:25.201Z');
    it('returns an mm/dd/yyyy formatted date string from a unix time stamp', () => {
      expect(result).toEqual('08/11/2015');
    });
  });

});
