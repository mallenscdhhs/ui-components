var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var Select = require('../../src/Select');
var fixture = require('../fixtures/field-select.json');
var update = require('react/lib/update');

describe('Select', function(){

  it('can render a select input with options', function(){
    var comp = TestUtils.renderIntoDocument(<Select {...fixture}/>);
    var dom = comp.getDOMNode();
    expect(dom.tagName.toLowerCase()).toEqual('select');
    expect(dom.childNodes.length).toEqual(2);
    expect(dom.id).toEqual(fixture.id);
    expect(dom.name).toEqual(fixture.name);
    expect(dom.childNodes[0].tagName.toLowerCase()).toEqual('option');
    expect(dom.childNodes[0].value).toEqual(fixture.options.items[0].value);
  });

  it('can render a mulitple select input', function(){
    var config = update(fixture, {multiple: {$set: true}});
    var comp = TestUtils.renderIntoDocument(<Select {...config}/>);
    var dom = comp.getDOMNode();
    expect(comp.state.value).toEqual([]);
    expect(dom.getAttribute('multiple')).not.toBeNull();
  });

});
