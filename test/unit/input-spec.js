var React = require('react');
require('es6-promise').polyfill();
var Input = require('../../src/Input');
var fixture = require('../fixtures/field-text.json');
var TestUtils = require('react/lib/ReactTestUtils');
var update = require('react/lib/update');

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

});
