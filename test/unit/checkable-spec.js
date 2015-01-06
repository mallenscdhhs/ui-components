var React = require('react');
var fixture = require('../fixtures/radio.json');
var Checkable = require('../../src/Checkable');
var Queue = require('../../src/EventQueue');
var TestUtils = require('react/lib/ReactTestUtils');
var update = require('react/lib/update');

describe('Checkable', function(){

  it('can render a single radio input', function(){
    var dom = TestUtils.renderIntoDocument(<Checkable {...fixture.config}/>);
    var wrapperDiv = dom.getDOMNode();
    var label = wrapperDiv.childNodes[1];
    var input = label.childNodes[0];
    var labelText = label.childNodes[1];
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
    Queue.subscribe('field:value:change', 'radio-test', function(data){
      expect(data.id).toEqual(fixture.config.id);
      expect(data.name).toEqual(fixture.config.name);
      expect(data.value).toBe(fixture.config.value);
      Queue.unSubscribe('field:value:change', 'radio-test');
      done();
    });
    var comp = TestUtils.renderIntoDocument(<Checkable {...fixture.config}/>);
    var radio = comp.getDOMNode().childNodes[1].childNodes[0];
    TestUtils.Simulate.change(radio, {target: {checked: true}});
  });

  it('will publish a value of "null" if input is not checked', function(done){
    Queue.subscribe('field:value:change', 'radio-test', function(data){
      expect(data.id).toEqual(fixture.config.id);
      expect(data.name).toEqual(fixture.config.name);
      expect(data.value).toBe(null);
      Queue.unSubscribe('field:value:change', 'radio-test');
      done();
    });
    var comp = TestUtils.renderIntoDocument(<Checkable {...fixture.config}/>);
    var radio = comp.getDOMNode().childNodes[1].childNodes[0];
    TestUtils.Simulate.change(radio, {target: {checked: false}});
  });

  it('will publish a "fieldGroup:item:change" event if input is part of a group', function(done){
    Queue.subscribe('fieldGroup:item:change', 'radio-test', function(data){
      expect(data.id).toEqual(fixture.config.id);
      expect(data.name).toEqual(fixture.config.name);
      expect(data.value).toBe(null);
      Queue.unSubscribe('fieldGroup:item:change', 'radio-test');
      done();
    });
    var config = update(fixture.config, {isFieldGroup: {$set: true}});
    var comp = TestUtils.renderIntoDocument(<Checkable {...config}/>);
    var radio = comp.getDOMNode().childNodes[1].childNodes[0];
    TestUtils.Simulate.change(radio, {target: {checked: false}});
  });

});
