var React = require('react');
require('es6-promise').polyfill();
var fixture = require('../fixtures/radio.json');
var Checkable = require('../../src/Checkable');
var TestUtils = require('react/lib/ReactTestUtils');
var update = require('react/lib/update');
var Dispatcher = require('fluxify').dispatcher;
var Constants = require('../../src/Constants.js');

describe('Checkable', function(){

  it('can render a single radio input', function(){
    var dom = TestUtils.renderIntoDocument(<Checkable {...fixture.config}/>);
    var wrapperDiv = dom.getDOMNode();
    var label = wrapperDiv.childNodes[1];
    var input = label.childNodes[0];
    dom.setState({display: true});
    expect(wrapperDiv.className).toEqual('editable-component radio');
    expect(label.getAttribute('for')).toEqual(fixture.config.id);
    expect(input.type).toEqual(fixture.config.type);
    expect(input.value).toEqual(fixture.config.value);
    expect(input.name).toEqual(fixture.config.name);
    expect(input.checked).toBe(false);
  });

  it('can render a required radio input', function(){
    var config = update(fixture.config, {required: {$set: true}});
    var dom = TestUtils.renderIntoDocument(<Checkable {...config}/>);
    var label = dom.getDOMNode().childNodes[1];
    expect(label.childNodes.length).toEqual(4);
    expect(label.childNodes[1].textContent).toEqual(fixture.config.label);
    expect(label.childNodes[3].textContent).toEqual(' *');
  });

  it('can render a checked radio input', function(){
    var config = update(fixture.config, {checked: {$set: true}});
    var dom = TestUtils.renderIntoDocument(<Checkable {...config}/>);
    var input = dom.getDOMNode().childNodes[1].childNodes[0];
    expect(input.checked).toBe(true);
  });

  it('can publish a radio input value on change', function(done){
    Dispatcher.register( 'CHECKABLE-TEST-1', function(payload){
      if( payload.actionType === Constants.actions.FIELD_VALUE_CHANGE &&
          payload.data.id === fixture.config.id) {
          expect(payload.data.id).toEqual(fixture.config.id);
          expect(payload.data.name).toEqual(fixture.config.name);
          expect(payload.data.value).toBe(fixture.config.value);
          Dispatcher.unregister( 'CHECKABLE-TEST-1' );
          done();
      }
    }.bind(this));
    var comp = TestUtils.renderIntoDocument(<Checkable {...fixture.config}/>);
    var radio = comp.getDOMNode().childNodes[1].childNodes[0];
    TestUtils.Simulate.change(radio, {target: {checked: true}});
  });

  it('will publish a value of "null" if input is not checked', function(done){
    Dispatcher.register( 'CHECKABLE-TEST-2', function(payload){
      if( payload.actionType === Constants.actions.FIELD_VALUE_CHANGE &&
          payload.data.id === fixture.config.id) {
          expect(payload.data.id).toEqual(fixture.config.id);
          expect(payload.data.name).toEqual(fixture.config.name);
          expect(payload.data.value).toBe(null);
          Dispatcher.unregister( 'CHECKABLE-TEST-2' );
          done();
      }
    }.bind(this));
    var comp = TestUtils.renderIntoDocument(<Checkable {...fixture.config}/>);
    var radio = comp.getDOMNode().childNodes[1].childNodes[0];
    TestUtils.Simulate.change(radio, {target: {checked: false}});
  });

  it('will publish a "fieldGroup:item:change" event if input is part of a group', function(done){
    Dispatcher.register( 'CHECKABLE-TEST-3', function(payload){
      if( payload.actionType === Constants.actions.FIELD_GROUP_VALUE_CHANGE &&
          payload.data.id === fixture.config.id) {
          expect(payload.data.id).toEqual(fixture.config.id);
          expect(payload.data.name).toEqual(fixture.config.name);
          expect(payload.data.value).toBe(null);
          Dispatcher.unregister( 'CHECKABLE-TEST-3' );
          done();
      }
    }.bind(this));
    var config = update(fixture.config, {isFieldGroup: {$set: true}, 'parent':{$set : 'parent123'}});
    var comp = TestUtils.renderIntoDocument(<Checkable {...config}/>);
    var radio = comp.getDOMNode().childNodes[1].childNodes[0];
    TestUtils.Simulate.change(radio, {target: {checked: false}});
  });

});
