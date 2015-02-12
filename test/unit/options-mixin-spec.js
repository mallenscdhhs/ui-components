var constants = require('../../src/constants');
var Components = require('../../src/main');
require('es6-promise').polyfill();
var Select = require('../../src/Select');
var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var update = require('react/lib/update');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var fixture = require('../fixtures/options-mixin.json');
var OptionsStore = require('../../src/OptionsStore');

describe('OptionsMixin', function(){

  beforeEach(function(){
    Components.configure({"API":{"options":"/api/resource"}});
  });

  it('can load options from props', function(){
    var component = TestUtils.renderIntoDocument(<Select {...fixture.config}/>);
    expect(component.state.options.length).toEqual(1);
    expect(component.state.options[0].value).toEqual(fixture.config.options[0].value);
  });

  it('can request resource options to be loaded', function(done){

    var reqFixture = {
      "type": "field",
      "config": {
        "type": "select",
        "id": "test",
        "name": "test",
        "label": "Test",
        "optionsResource":  "test"
      }
    };

    var resourcePayload ={
      "module" : "PE",
      "operation" : "SUCCESS",
      "payloadClassName" : "",
      "responsePayload" : {
        "result" :  [
          {"description" : "resourceOne", "code" : 1},
          {"description" : "resourceTwo", "code" : 2}
        ]
      }
    };

    spyOn( $, 'ajax' ).and.callFake(function(params){ 
      var ajaxMock = $.Deferred();
      expect(params.url).toEqual("/api/resource/test");
      ajaxMock.resolve(resourcePayload);
      return ajaxMock.promise();
    });

    Dispatcher.register('test-opt-mixin-LOAD-RESOURCE', function(action,items){
      if ( action === constants.actions.LOAD_OPTIONS ) {
        expect(items[0].description).toEqual(resourcePayload.responsePayload.result[0].description);
        Dispatcher.unregister('test-opt-mixin-LOAD-RESOURCE');
        done();
      }
    });

    Flux.doAction(constants.actions.SEND_RESOURCE_OPTIONS, {
      "resourceName" : reqFixture.config.optionsResource,
      "fieldId" : reqFixture.config.id
    });

  });

  it('can request custom options to be loaded', function(done){

    var custFixture = {
      "type": "field",
      "config": {
        "type": "select",
        "id": "test",
        "name": "test",
        "label": "Test",
        "optionsResource": "test"
      }
    };

    var customPayload = [
      {"description" : "customOne", "code" : 1},
      {"description" : "customTwo", "code" : 2}
    ];

    Dispatcher.register('test-opt-mixin-LOAD-CUSTOM', function(action,items){
      if ( action === constants.actions.LOAD_OPTIONS) {
        expect(items[0].description).toEqual(customPayload[0].description);
        Dispatcher.unregister('test-opt-mixin-LOAD-CUSTOM');
        done();
      }
    });

    Dispatcher.register('test-opt-mixin-SEND-CUSTOM-OPTIONS', function(action,data){
      if ( action === constants.actions.SEND_OPTIONS ) {
        expect(data.fieldId).toEqual(custFixture.config.id);
        Flux.doAction(constants.actions.LOAD_OPTIONS,customPayload);
      }
      Dispatcher.unregister('test-opt-mixin-SEND-CUSTOM-OPTIONS');
    });

    Flux.doAction(constants.actions.SEND_OPTIONS, {
      "fieldId" : custFixture.config.id
    });

  });
});
