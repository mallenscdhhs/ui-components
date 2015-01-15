var constants = require('../../src/constants');
var Select = require('../../src/Select');
var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var update = require('react/lib/update');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var fixture = require('../fixtures/options-mixin.json');

describe('OptionsMixin', function(){
  it('can load options from props', function(){
    var component = TestUtils.renderIntoDocument(<Select {...fixture.config}/>);
    expect(component.state.options.length).toEqual(1);
    expect(component.state.options[0].value).toEqual(fixture.config.options.items[0].value);
  });

  it('can request options to be loaded', function(done){
    var config = update(fixture.config, {
      options: {
        items: { $set: null }
      }
    });
    Dispatcher.register('test-opt-mixin', function(action){
      if ( action.actionType === constants.actions.SEND_OPTIONS ) {
        expect(action.data.fieldId).toEqual(config.id);
        expect(action.data.resourceName).toEqual(config.options.name);
        Dispatcher.unregister('test-opt-mixin');
        done();
      }
    });
    TestUtils.renderIntoDocument(<Select {...config}/>);
  });

  it('can load options from action', function(done){
    var config = update(fixture.config, {
      options: {
        items: { $set: null }
      }
    });
    var data = {
      id: config.id,
      options: [{value:'foo', label:'Foo'}]
    };
    var component;
    Dispatcher.register('test-opt-mixin-send', function(action){
      if ( action.actionType === constants.actions.SEND_OPTIONS ) {
        Flux.doAction({
          actionType: constants.actions.LOAD_OPTIONS,
          data: data
        });
        Dispatcher.unregister('test-opt-mixin-send');
      }
    });
    Dispatcher.register('test-opt-mixin-load', function(action){
      if ( action.actionType === constants.actions.LOAD_OPTIONS ) {
        expect(action.data.id).toEqual(config.id);
        expect(action.data.options).toEqual(data.options);
        Dispatcher.unregister('test-opt-mixin-load');
        setTimeout(function(){
          expect(component.state.options).toEqual(data.options);
          done();
        }, 500);
      }
    });
    component = TestUtils.renderIntoDocument(<Select {...config}/>);
  });
});
