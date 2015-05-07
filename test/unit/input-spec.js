var React = require('react');
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
    var numCount = 0;
    // simulate entering a single character at a time
    setTimeout(function() {
      // initial value change
      TestUtils.Simulate.change(dom, {target: {value: '0'}});
    }, 100);

    // listen for FIELD_VALUE_CHANGE and test final value and unmasked value
    Dispatcher.register( 'test-ssn-change' , function(action, data){
      if( action === constants.actions.FIELD_VALUE_CHANGE &&
          data.id === 'test-ssn') {
        if(data.unmasked === '012345678') {
          Dispatcher.unregister('test-ssn-change');
          expect(data.value).toEqual('***-**-5678');
          expect(data.unmasked).toEqual('012345678');
          done();
        } else {
          numCount++;
          TestUtils.Simulate.change(dom, {target: {value: dom.value + numCount.toString()}});
        }
      }
    });
  });

  it('can support masking pasted input values', function(done){
    var config = update(fixture, {id: {$set: 'test-date'}, mask: {$set: '00/00/XXXX'}});
    var comp = TestUtils.renderIntoDocument(<Input {...config}/>);
    var dom = comp.getDOMNode();
    var date = '01011979';
    // simulate pasting a full length string
    setTimeout(function() {
      // initial value change
      TestUtils.Simulate.change(dom, {target: {value: date}, pasted: date});
    }, 100);

    // listen for FIELD_VALUE_CHANGE and test final value and unmasked value
    Dispatcher.register( 'test-date-change' , function(action, data){
      if( action === constants.actions.FIELD_VALUE_CHANGE &&
          data.id === 'test-date') {
        Dispatcher.unregister('test-date-change');
        expect(data.value).toEqual('**/**/1979');
        expect(data.unmasked).toEqual(date);
        done();
      }
    });
  });

  it('can support suppyling a custom MaskSymbol', function(done){
    var config = update(fixture, {id: {$set: 'test-cc'}, mask: {$set: '0000 0000 0000 XXXX'}, maskSymbol: {$set: '$'}});
    var comp = TestUtils.renderIntoDocument(<Input {...config}/>);
    var dom = comp.getDOMNode();
    var ccNum = '0101010101010101';
    // simulate pasting a full length string
    setTimeout(function() {
      // initial value change
      TestUtils.Simulate.change(dom, {target: {value: ccNum}, pasted: ccNum});
    }, 100);

    // listen for FIELD_VALUE_CHANGE and test final value and unmasked value
    Dispatcher.register( 'test-cc-change' , function(action, data){
      if( action === constants.actions.FIELD_VALUE_CHANGE &&
          data.id === 'test-cc') {
        Dispatcher.unregister('test-cc-change');
        expect(data.value).toEqual('$$$$ $$$$ $$$$ 0101');
        expect(data.unmasked).toEqual(ccNum);
        done();
      }
    });
  });

  it('can force manual input', function(){
    var config = update(fixture, {forceManualInput: {$set: true}});
    var comp = TestUtils.renderIntoDocument(<Input {...config}/>);
    var dom = comp.getDOMNode();
    // verify that autocomplete attribute (along with the other internal helper props that don't render in the dom) is added to the input
    expect( dom.getAttribute('autocomplete') ).toEqual('off');
  });

});
