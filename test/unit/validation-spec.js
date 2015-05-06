var React = require('react');
var Components = require('../../src/main');
var _ = require('lodash');
var TestUtils = require('react/lib/ReactTestUtils');
var constants = require('../../src/constants');
var ValidationStore = require('../../src/ValidationStore');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var successPayload = require('../fixtures/validation-success-payload.json');


describe('Validation', function() {

  beforeEach(function(){
    Components.configure({"API":{"validation":"/api/rules"}});
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });


  it('call validation rules and get SUCCESS', function (done) {

    var fixture = {
      'id': 'idtest',
      'name': 'nameTest',
      'value': 'valueTest',
      'rules' : {
        'rule1': true,
        'rule2': false
      }
    };

    spyOn($, 'ajax').and.callFake(function(params){
      var ajaxMock = $.Deferred();
      var data = JSON.parse(params.data);
      expect(params.url).toEqual("/api/rules");
      expect(params.contentType).toEqual('application/json; charset=UTF-8');
      expect(data.rules.length).toEqual(1);
      expect(data.rules[0].ruleName).toEqual('rule1');
      expect(data.input[fixture.name]).toEqual(fixture.value);
      ajaxMock.resolve(successPayload);
      return ajaxMock.promise();
    });

    Dispatcher.register('field-validation-success-test',function(action,data) {
      if( action === constants.actions.FIELD_VALIDATION_ERROR &&
          data.id === fixture.id){
        expect(data.hasError).toEqual(false);
        expect(data.errorMessage).toEqual('');
        done();
        Dispatcher.unregister('field-validation-success-test');
      }
    });

    Dispatcher.register('session-store-success-test',function(action,data){
      if(action === constants.actions.GET_SESSION_VALUES && data.id === fixture.id){
        var sessions = [
          {'sessionField1':'value1'},
          {'sessionField2':'value2'}
        ];
        Flux.doAction( constants.actions.SESSION_VALUES_LOADED , sessions, data );
        Dispatcher.unregister('session-store-success-test');
      }
    });

    Flux.doAction( constants.actions.FIELD_VALUE_CHANGE , fixture);

  });

  it('call validation rules and get FAILURE', function (done) {
    var sessionCallback = 'session-store-failure-test';
    var validationCallback = 'field-validation-failure-test';
    var failurePayload = require('../fixtures/validation-failure-payload.json');
    var fixture = {
      'id': 'idtest',
      'name': 'nameTest',
      'value': 'valueTest',
      'rules' : {
        'rule1': true,
        'rule2': true
      }
    };

    spyOn($, 'ajax').and.callFake(function(params){
      var ajaxMock = $.Deferred();
      var data = JSON.parse(params.data);
      expect(params.url).toEqual("/api/rules");
      expect(params.contentType).toEqual('application/json; charset=UTF-8');
      expect(data.rules.length).toEqual(2);
      expect(data.rules[0].ruleName).toEqual('rule1');
      expect(data.rules[1].ruleName).toEqual('rule2');
      expect(data.input[fixture.name]).toEqual(fixture.value);
      ajaxMock.resolve(failurePayload);
      return ajaxMock.promise();
    });

    Dispatcher.register(validationCallback, function(action, data) {
      if( action === constants.actions.FIELD_VALIDATION_ERROR && data.id === fixture.id){
        var errorMessage = failurePayload.operationMessages[0].description + '<br>' + failurePayload.operationMessages[1].description;
        expect(data.hasError).toEqual(true);
        expect(data.errorMessage).toEqual(errorMessage);
        Dispatcher.unregister(validationCallback);
        done();
      }
    });

    Dispatcher.register(sessionCallback, function(action, data){
      if(action === constants.actions.GET_SESSION_VALUES && data.id === fixture.id){
        var sessions = [
          {'sessionField1':'value1'},
          {'sessionField2':'value2'}
        ];
        Dispatcher.unregister(sessionCallback);
        Flux.doAction( constants.actions.SESSION_VALUES_LOADED , sessions , data );
      }
    });

    Flux.doAction( constants.actions.FIELD_VALUE_CHANGE , fixture);
  });

  it('will not call validation if disabled or not visible', function (done) {

    var fixtureDisabled = {
      'id': 'idtest',
      'name': 'nameTest',
      'value': 'valueTest',
      'rules' : {
        'rule1': true,
        'rule2': false
      },
      'disabled' : true
    };

    var fixtureVisibile = {
      'id': 'idtest',
      'name': 'nameTest',
      'value': 'valueTest',
      'rules' : {
        'rule1': true,
        'rule2': false
      },
      'visible' : 'hidden'
    };

    jasmine.Ajax
      .stubRequest('/api/rules')
      .andReturn(successPayload);

    Flux.doAction( constants.actions.FIELD_VALUE_CHANGE , fixtureDisabled)
      .then(function(){
        var request = jasmine.Ajax.requests.mostRecent();
        expect(request).not.toBeDefined();

        Flux.doAction( constants.actions.FIELD_VALUE_CHANGE , fixtureVisibile)
          .then(function(){
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request).not.toBeDefined();
            done();
          });
      });
  });

});
