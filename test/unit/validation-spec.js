import React from 'react';
import Components from '../../src/main';
import _ from 'lodash';
import TestUtils from 'react/lib/ReactTestUtils';
import constants from '../../src/constants';
import ValidationStore from '../../src/ValidationStore';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import fixture from '../fixtures/validation';

let {
  FIELD_VALIDATION_ERROR,
  GET_SESSION_VALUES,
  SESSION_VALUES_LOADED,
  FIELD_VALUE_CHANGE
} = constants.actions;

describe('Validation', () => {

  beforeEach(() => {
    Components.configure({
      API: {
        validation: '/api/rules'
      }
    });
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });


  it('call validation rules and get SUCCESS', (done) => {
    jasmine.Ajax
      .stubRequest('/api/rules')
      .andReturn(fixture.fieldResponse);

    Dispatcher.register('field-validation-success-test', (action, data) => {
      if( action === FIELD_VALIDATION_ERROR && data.id === fixture.field.id){
        Dispatcher.unregister('field-validation-success-test');
        let req = jasmine.Ajax.requests.mostRecent();
        let params = req.data();
        // inspect the request data
        expect(params.rules.length).toEqual(2);
        expect(params.input[fixture.field.name]).toEqual(fixture.field.value);
        // inspect response
        expect(data.hasError).toEqual(false);
        expect(data.errorMessage).toEqual('');
        done();
      }
    });

    Dispatcher.register('session-store-success-test', (action, data) => {
      if(action === GET_SESSION_VALUES && data.id === fixture.field.id){
        Dispatcher.unregister('session-store-success-test');
        let sessions = [
          {sessionField1: 'value1'},
          {sessionField2: 'value2'}
        ];
        Dispatcher.dispatch(SESSION_VALUES_LOADED, sessions, data);
      }
    });

    Dispatcher.dispatch(FIELD_VALUE_CHANGE, fixture.field);
  });

  it('call validation rules and get FAILURE', (done) => {
    let handler1 = Dispatcher.register((action, data) => {
      if( action === FIELD_VALIDATION_ERROR && data.id === fixture.field.id){
        Dispatcher.unregister(handler1);
        let messages = fixture.failureResponse.responseData.operationMessages;
        let errorMessage = messages.map(msg => msg.description).join('<br>');
        let req = jasmine.Ajax.requests.mostRecent();
        let params = req.data();
        expect(data.hasError).toEqual(true);
        expect(data.errorMessage).toEqual(errorMessage);
        // inspect request
        expect(params.rules.length).toEqual(2);
        expect(params.input[fixture.field.name]).toEqual(fixture.field.value);
        done();
      }
    });

    let handler2 = Dispatcher.register((action, data) => {
      if(action === GET_SESSION_VALUES && data.id === fixture.field.id){
        Dispatcher.unregister(handler2);
        let sessions = [
          {sessionField1: 'value1'},
          {sessionField2: 'value2'}
        ];
        Dispatcher.dispatch(SESSION_VALUES_LOADED, sessions , data);
      }
    });

    jasmine.Ajax
      .stubRequest('/api/rules')
      .andReturn(fixture.failureResponse);

    Dispatcher.dispatch(FIELD_VALUE_CHANGE, fixture.field);
  });

  it('will not call validation if disabled or not visible', (done) => {
    jasmine.Ajax
      .stubRequest('/api/rules')
      .andReturn(fixture.fieldResponse);

    Dispatcher.dispatch(FIELD_VALUE_CHANGE, fixture.disabledField).then(() => {
      let request = jasmine.Ajax.requests.mostRecent();
      expect(request).not.toBeDefined();
      Dispatcher.dispatch(FIELD_VALUE_CHANGE, fixture.hiddenField).then(() => {
        let request = jasmine.Ajax.requests.mostRecent();
        expect(request).not.toBeDefined();
        done();
      });
    });
  });

  it('will pass an empty string as input if no value is supplied', (done) => {
    let handler = Dispatcher.register((action, data) => {
      if (action === FIELD_VALIDATION_ERROR) {
        Dispatcher.unregister(handler);
        let request = jasmine.Ajax.requests.mostRecent();
        console.log(request.data());
        expect(request.data().input[fixture.emptyField.name]).toEqual('');
        done();
      }
    });

    jasmine.Ajax
      .stubRequest('/api/rules')
      .andReturn(fixture.fieldResponse);

    Dispatcher.dispatch(SESSION_VALUES_LOADED, {}, fixture.emptyField);
  });

});
