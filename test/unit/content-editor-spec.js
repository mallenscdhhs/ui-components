var React = require('react');
require('es6-promise').polyfill();
var ContentEditor = require('../../src/ContentEditor');
var TestUtils = require('react/lib/ReactTestUtils');
var fixture = require('../fixtures/field-contenteditor.json');

describe('ContentEditor', function(){

  it('can render a contenteditor input', function(){
    var comp = TestUtils.renderIntoDocument(<ContentEditor {...fixture}/>);
    var dom = comp.getDOMNode();
    expect(dom.tagName.toLowerCase()).toEqual('div');
    expect(dom.id).toEqual(fixture.id);
  });

  it('pen plugin is updating component value properly', function(done){
    var testValue = '<p>testing!</p>';
    var comp = TestUtils.renderIntoDocument(<ContentEditor {...fixture}/>);
    expect(comp.state.value).toEqual(fixture.value); // Test Init value
    comp.state.editor.setContent(testValue); // Use Pen to update editor value
    setTimeout(function(){
      expect(comp.state.value).toEqual(testValue); // expect editor to update component value
      done();
    },10);
  });

});
