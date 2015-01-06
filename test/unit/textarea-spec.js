var React = require('react');
var Textarea = require('../../src/Textarea');
var TestUtils = require('react/lib/ReactTestUtils');
var fixture = require('../fixtures/field-textarea.json');

describe('Textarea', function(){

  it('can render a textarea input', function(){
    var comp = TestUtils.renderIntoDocument(<Textarea {...fixture}/>);
    var dom = comp.getDOMNode();
    expect(dom.tagName.toLowerCase()).toEqual('textarea');
    expect(dom.id).toEqual(fixture.id);
    expect(dom.name).toEqual(fixture.name);
    expect(dom.value).toEqual(fixture.value);
  });

});