var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var FieldGroup = require('../../src/FieldGroup');
var fixture = require('../fixtures/field-group.json');
var EQ = require('../../src/EventQueue');
var update = require('react/lib/update');

describe('FieldGroup', function(){

  it('can render a list of checkboxes', function(){
    var comp = TestUtils.renderIntoDocument(<FieldGroup {...fixture}/>);
    var dom = comp.getDOMNode();
    var checkboxes = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    expect(dom.tagName.toLowerCase()).toEqual('fieldset');
    expect(dom.childNodes.length).toEqual(6);
    expect(dom.childNodes[1].tagName.toLowerCase()).toEqual('legend');
    expect(checkboxes.length).toEqual(fixture.options.items.length);
    expect(checkboxes[0].getDOMNode().type).toEqual('checkbox');
    expect(checkboxes[0].getDOMNode().value).toEqual(fixture.options.items[0].value);
  });

  it('can render a list of radio inputs', function(){
    var config = update(fixture, {type: {$set: 'radio'}});
    var comp = TestUtils.renderIntoDocument(<FieldGroup {...config}/>);
    var dom = comp.getDOMNode();
    var checkboxes = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    expect(dom.tagName.toLowerCase()).toEqual('fieldset');
    expect(dom.childNodes.length).toEqual(6);
    expect(dom.childNodes[1].tagName.toLowerCase()).toEqual('legend');
    expect(checkboxes.length).toEqual(fixture.options.items.length);
    expect(checkboxes[0].getDOMNode().type).toEqual('radio');
    expect(checkboxes[0].getDOMNode().value).toEqual(fixture.options.items[0].value);
  });

  it('can manage a list of values for checkboxes', function(done){
    var comp = TestUtils.renderIntoDocument(<FieldGroup {...fixture}/>);
    var dom = comp.getDOMNode();
    var checkboxes = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    var numChanges = 0;
    expect(comp.state.value).toEqual([]);
    EQ.subscribe('field:value:change', 'test', function(data){
      numChanges += 1;
      if ( numChanges === 2 && data.id === fixture.id ) {
        expect(data.value.join(',')).toEqual('1,2');
        EQ.unSubscribe('field:value:change', 'test');
        done();
      }
    });
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
    EQ.subscribe('field:value:change', 'test', function(data){
      numChanges += 1;
      expect(data.value).toEqual(numChanges.toString());
      if ( numChanges === 2 ) {
        EQ.unSubscribe('field:value:change', 'test');
        done();
      }
    });
    TestUtils.Simulate.change(radios[0].getDOMNode(), {target: {checked: true}});
    TestUtils.Simulate.change(radios[1].getDOMNode(), {target: {checked: true}});
  });
});
