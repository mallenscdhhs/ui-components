var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var FieldGroup = require('../../src/FieldGroup');
var fixture = require('../fixtures/field-group.json').config;
var Dispatcher = require('fluxify').dispatcher;
var constants = require('../../src/constants');
var update = require('react/lib/update');

describe('FieldGroup', function(){

  it('can render a list of checkboxes', function(){
    var comp = TestUtils.renderIntoDocument(<FieldGroup {...fixture}/>);
    var checkboxes = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    expect(checkboxes.length).toEqual(fixture.options.length);
    expect(checkboxes[0].getDOMNode().type).toEqual('checkbox');
    expect(checkboxes[0].getDOMNode().value).toEqual(fixture.options[0].value);
  });

  it('can render a list of radio inputs', function(){
    var config = update(fixture, {type: {$set: 'radio'}});
    var comp = TestUtils.renderIntoDocument(<FieldGroup {...config}/>);
    var checkboxes = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    expect(checkboxes.length).toEqual(fixture.options.length);
    expect(checkboxes[0].getDOMNode().type).toEqual('radio');
    expect(checkboxes[0].getDOMNode().value).toEqual(fixture.options[0].value);
  });

  it('can manage a list of values for checkboxes', function(done){
    var comp = TestUtils.renderIntoDocument(<FieldGroup {...fixture}/>);
    var dom = comp.getDOMNode();
    var checkboxes = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    var numChanges = 0;
    expect(comp.state.value).toEqual([]);
    Dispatcher.register( 'FIELD-GROUP-TEST-1', function(action,data){
      if( action === constants.actions.FIELD_VALUE_CHANGE &&
          data.name === fixture.name) {
        numChanges += 1;
        if ( numChanges === 2 && data.id === fixture.id ) {
          expect(data.value.join(',')).toEqual('1,2');
          Dispatcher.unregister( 'FIELD-GROUP-TEST-1');
          done();
        }
      }
    }.bind(this));
    TestUtils.Simulate.change(checkboxes[0].getDOMNode(), {target: {checked: true}});
    TestUtils.Simulate.change(checkboxes[1].getDOMNode(), {target: {checked: true}});
  });

  it('can manage a single value for radios', function(done){
    var config = update(fixture, {type: {$set: 'radio'}});
    var comp = TestUtils.renderIntoDocument(<FieldGroup {...config}/>);
    var dom = comp.getDOMNode();
    var radios = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    var numChanges = 0;
    expect(comp.state.value).toEqual('');
    Dispatcher.register( 'FIELD-GROUP-TEST-2', function(action,data){
      if( action === constants.actions.FIELD_VALUE_CHANGE &&
          data.name === fixture.name) {
        numChanges += 1;
        expect(data.value).toEqual(numChanges.toString());
        if ( numChanges === 2 ) {
          Dispatcher.unregister( 'FIELD-GROUP-TEST-2');
          done();
        }
      }
    }.bind(this));
    setTimeout(function() {
      TestUtils.Simulate.change(radios[0].getDOMNode(), {target: {checked: true}});
    },100);
    setTimeout(function() {
      TestUtils.Simulate.change(radios[1].getDOMNode(), {target: {checked: true}});
    },200);
  });
});
