var React = require('react/addons');
var ContentEditor = require('../../src/ContentEditor');
var TestUtils = React.addons.TestUtils;
var fixture = require('../fixtures/field-contenteditor.json');

describe('ContentEditor', function(){

  it('can render a contenteditor input', function(){
    var comp = TestUtils.renderIntoDocument(<ContentEditor {...fixture}/>);
    var dom = comp.getDOMNode();
    expect(dom.tagName.toLowerCase()).toEqual('div');
    expect(dom.id).toEqual(fixture.id);
  });

});