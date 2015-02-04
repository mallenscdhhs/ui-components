var React = require('react');
require('es6-promise').polyfill();
var Date = require('../../src/Date');
var TestUtils = require('react/lib/ReactTestUtils');
var fixture = require('../fixtures/field-date.json');

describe('Date input', function(){

  it('can render a date input', function(){
    var comp = TestUtils.renderIntoDocument(<Date {...fixture}/>);
    var container = comp.getDOMNode();
    var dom = container.childNodes[0];
    expect(container.id).toEqual(fixture.id);
    expect(dom.tagName.toLowerCase()).toEqual('input');
    expect(dom.name).toEqual(fixture.name);
    expect(dom.value).toEqual(fixture.value);
    expect(dom.getAttribute('disabled')).toBeNull();
  });

  it('can update date input value', function(){
    var comp = TestUtils.renderIntoDocument(<Date {...fixture}/>);
    var container = comp.getDOMNode();
    var dom = container.childNodes[0];
    expect(dom.value).toEqual(fixture.value);
    TestUtils.Simulate.change(dom, {target: {value: '03/15/2013'}});
    expect(dom.value).toEqual('03/15/2013');
  });

});