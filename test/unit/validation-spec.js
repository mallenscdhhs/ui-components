var React = require('react');
require('es6-promise').polyfill();
var Components = require('../../src/main');
var _ = require('lodash');
var TestUtils = require('react/lib/ReactTestUtils');
var Workflow = require('../../src/Workflow');
var constants = require('../../src/constants');
var ValidationStore = require('../../src/ValidationStore');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;


describe('Validation', function() {

  beforeEach(function(){
    Components.configure({"API":{"validation":"/api/rules"}});
  });

  it('call validation rules and get SUCCESS', function (done) {

    var fixture = {
      'id': 'idtest',
      'name': 'nameTest',
      'value': 'valueTest',
      'rules' : ['rule1','rule2']
    };

    var successPayload = {
      "module" : "PE",
      "operationStatus" : "SUCCESS",
      "responsePayload" : {
        "message" : "Updated Successfully."
      }
    };

    spyOn( $, 'post' ).and.callFake(function(params){ 
      var ajaxMock = $.Deferred();
      var data = JSON.parse(params.data);
      expect(params.url).toEqual("/api/rules");
      expect(params.contentType).toEqual('application/json; charset=UTF-8');
      expect(data.rules[0].ruleName).toEqual(fixture.rules[0]);
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
        Dispatcher.unregister('field-validation-success-test')
      }
    });

    Dispatcher.register('session-store-success-test',function(action,data){
      if(action === constants.actions.GET_SESSION_VALUES){
        var sessions = [
          {'sessionField1':'value1'},
          {'sessionField2':'value2'}
        ];
        Flux.doAction( constants.actions.SESSION_VALUES_LOADED , sessions, data );
        Dispatcher.unregister('session-store-success-test')
      }
    });

    Flux.doAction( constants.actions.FIELD_VALUE_CHANGE , fixture);

  });

  it('call validation rules and get FAILURE', function (done) {

    var fixture = {
      'id': 'idtest',
      'name': 'nameTest',
      'value': 'valueTest',
      'rules' : ['rule1','rule2']
    };

    var failurePayload = {
      "module" : "PE",
      "operationStatus" : "FAILURE",
      "errors" : [{
        "metadata" : {
          "rule" : "BR_RULE1",
          "params" : ["nameTest"]
        },
        "errorCode" : "ERR_1001",
        "errorDesc" : "Field is not valid.",
        "level" : "INFO",
        "autoHide" : false
      },{
        "metadata" : {
          "rule" : "BR_RULE2",
          "params" : ["nameTest2"]
        },
        "errorCode" : "ERR_1002",
        "errorDesc" : "Field is not long enough.",
        "level" : "INFO",
        "autoHide" : false
      }]
    };

    spyOn( $, 'post' ).and.callFake(function(params){ 
      var ajaxMock = $.Deferred();
      var data = JSON.parse(params.data);
      expect(params.url).toEqual("/api/rules");
      expect(params.contentType).toEqual('application/json; charset=UTF-8');
      expect(data.rules[0].ruleName).toEqual(fixture.rules[0]);
      expect(data.input[fixture.name]).toEqual(fixture.value);
      ajaxMock.resolve(failurePayload);
      return ajaxMock.promise();
    });

    Dispatcher.register('field-validation-failure-test',function(action,data) {
      if( action === constants.actions.FIELD_VALIDATION_ERROR &&
          data.id === fixture.id){
        expect(data.hasError).toEqual(true);
        var errorMessage = failurePayload.errors[0].errorDesc + '<br>' + failurePayload.errors[1].errorDesc;
        expect(data.errorMessage).toEqual(errorMessage);
        done();
        Dispatcher.unregister('field-validation-failure-test')
      }
    });

    Dispatcher.register('session-store-failure-test',function(action,data){
      if(action === constants.actions.GET_SESSION_VALUES){
        var sessions = [
          {'sessionField1':'value1'},
          {'sessionField2':'value2'}
        ];
        Flux.doAction( constants.actions.SESSION_VALUES_LOADED , sessions , data );
        Dispatcher.unregister('session-store-failure-test')
      }
    });

    Flux.doAction( constants.actions.FIELD_VALUE_CHANGE , fixture);

  });

});
