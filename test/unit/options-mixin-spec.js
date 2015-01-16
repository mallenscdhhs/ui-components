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
    expect(component.state.options[0].value).toEqual(fixture.config.options.items[0].value);
  });

  it('can request resource options to be loaded', function(done){

    fixture = {
      "type": "field",
      "config": {
        "type": "select",
        "id": "test",
        "name": "test",
        "label": "Test",
        "options": {
          "name": "test"
        }
      }
    };

    var resourcePayload = [
      {"label" : "resourceOne", "value" : 1},
      {"label" : "resourceTwo", "value" : 2}
    ];

    spyOn( $, 'ajax' ).and.callFake(function(params){ 
      var ajaxMock = $.Deferred();
      expect(params.url).toEqual("/api/resource");
      expect(params.data.payload.fieldId).toEqual(fixture.config.id);
      expect(params.data.payload.resourceName).toEqual(fixture.config.options.name);
      ajaxMock.resolve(resourcePayload);
      return ajaxMock.promise();
    });

    Dispatcher.register('test-opt-mixin-LOAD-RESOURCE', function(action,items){
      if ( action === constants.actions.LOAD_OPTIONS ) {
        expect(items[0].label).toEqual(resourcePayload[0].label);
        expect(items[1].label).toEqual(resourcePayload[1].label);
        Dispatcher.unregister('test-opt-mixin');
        done();
      }
    });

    Flux.doAction(constants.actions.SEND_RESOURCE_OPTIONS, {
      "resourceName" : fixture.config.options.name,
      "fieldId" : fixture.config.id
    });

  });

  it('can request custom options to be loaded', function(done){

    fixture = {
      "type": "field",
      "config": {
        "type": "select",
        "id": "test",
        "name": "test",
        "label": "Test",
        "options": {
          "name": "test"
        }
      }
    };

    var resourcePayload = [
      {"label" : "resourceOne", "value" : 1},
      {"label" : "resourceTwo", "value" : 2}
    ];

    Dispatcher.register('test-opt-mixin-LOAD-CUSTOM', function(action,items){
      if ( action === constants.actions.LOAD_OPTIONS) {
        expect(items[0].label).toEqual(resourcePayload[0].label);
        expect(items[1].label).toEqual(resourcePayload[1].label);
        Dispatcher.unregister('test-opt-mixin-LOAD-CUSTOM');
        done();
      }
    });

    Dispatcher.register('test-opt-mixin-SEND-CUSTOM-OPTIONS', function(action,data){
      if ( action === constants.actions.SEND_OPTIONS ) {
        expect(data.fieldId).toEqual(fixture.config.id);
        Flux.doAction(constants.actions.LOAD_OPTIONS,resourcePayload);
      }
      Dispatcher.unregister('test-opt-mixin-SEND-CUSTOM-OPTIONS');
    });

    Flux.doAction(constants.actions.SEND_OPTIONS, {
      "fieldId" : fixture.config.id
    });

  });
});
