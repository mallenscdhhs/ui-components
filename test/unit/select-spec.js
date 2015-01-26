var React = require('react');
require('es6-promise').polyfill();
var TestUtils = require('react/lib/ReactTestUtils');
var Select = require('../../src/Select');
var fixture = require('../fixtures/field-select.json');
var update = require('react/lib/update');
var _ = require('lodash');

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

  it('can manage the slected option', function(){
    var comp = TestUtils.renderIntoDocument(<Select {...fixture}/>);
    var dom = comp.getDOMNode();
    TestUtils.Simulate.change(dom, {target: {value: '1', options: dom.options}});
    expect(comp.state.value).toEqual('1');
  });

  it('can manage multiple selected options', function(){
    var config = update(fixture, {multiple: {$set: true}});
    var comp = TestUtils.renderIntoDocument(<Select {...config}/>);
    var dom = comp.getDOMNode();
    var options = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'option');
    var opts = _.map(options, function(opt){ return opt.getDOMNode(); });
    opts[0].selected = true;
    TestUtils.Simulate.change(dom, {target: {value: '1', options: opts}});
    expect(comp.state.value).toEqual(['1']);
    opts[1].selected = true;
    TestUtils.Simulate.change(dom, {target: {value: '2', options: opts}});
    expect(comp.state.value).toEqual(['1', '2']);
  });

  it('will manage multiple default values', function(){
    var config = update(fixture, {
      multiple: {$set: true},
      value: {$set: ['1', '2']}
    });
    var comp = TestUtils.renderIntoDocument(<Select {...config}/>);
    var dom = comp.getDOMNode();
    var options = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'option');
    var opts = _.map(options, function(opt){ return opt.getDOMNode(); });
    opts[1].selected = false;
    TestUtils.Simulate.change(dom, {target: {value: '1', options: opts}});
    expect(comp.state.value).toEqual(['1']);
  });

});
