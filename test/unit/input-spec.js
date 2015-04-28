var React = require('react');
require('es6-promise').polyfill();
var update = require('react/lib/update');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('../../src/constants');
var Input = require('../../src/Input');
var fixture = require('../fixtures/field-text.json');
var TestUtils = require('react/lib/ReactTestUtils');
var _ = require('lodash');

describe('Input', function(){

  it('can render a text input', function(){
    var comp = TestUtils.renderIntoDocument(<Input {...fixture}/>);
    var dom = comp.getDOMNode();
    expect(dom.tagName.toLowerCase()).toEqual('input');
    expect(dom.type).toEqual(fixture.type);
    expect(dom.name).toEqual(fixture.name);
    expect(dom.id).toEqual(fixture.id);
    expect(dom.getAttribute('disabled')).toBeNull();
  });

  it('can render a disabled text input', function(){
    var config = update(fixture, {disabled: {$set: true}});
    var comp = TestUtils.renderIntoDocument(<Input {...config}/>);
    var dom = comp.getDOMNode();
    expect(dom.getAttribute('disabled')).toBeDefined();
  });

  it('can set a "maxLength" attribute', function(){
    var max = 10;
    var config = update(fixture, {maxLength: {$set: max}});
    var comp = TestUtils.renderIntoDocument(<Input {...config}/>);
    var dom = comp.getDOMNode();
    expect(dom.maxLength).toEqual(max);
  });

  it('can partially mask an input field', function(done){
    var config = update(fixture, {id: {$set: 'test-ssn'}, mask: {$set: '000-00-XXXX'}});
    var comp = TestUtils.renderIntoDocument(<Input {...config}/>);
    var dom = comp.getDOMNode();
    var ssn = '012345678';
    var currentValue = '';
    // simulate entering a single character at a time
    _.map(ssn, function(char) {
      currentValue = dom.value + char;
      TestUtils.Simulate.change(dom, {target: {value: currentValue}});
    });
    // listen for FIELD_VALUE_CHANGE and test final value and unmasked value
    Dispatcher.register( 'test-ssn-change' , function(action, data){
      if( action === constants.actions.FIELD_VALUE_CHANGE &&
          data.id === 'test-ssn') {
        if(data.unmasked === ssn) {
          Dispatcher.unregister('test-ssn-change');
          expect(data.value).toEqual('***-**-5678');
          expect(data.unmasked).toEqual('012345678');
          done();
        }
      }
    });
  });

});
