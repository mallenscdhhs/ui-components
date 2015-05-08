var React = require('react');
var Action = require('../../src/Action');
var TestUtils = require('react/lib/ReactTestUtils');
var fixture = require('../fixtures/action.json');

describe('Action component', function() {

  it('Renders action', function(){
    var action = TestUtils.renderIntoDocument(<Action {...fixture.config}/>);
    var inputText = TestUtils.scryRenderedDOMComponentsWithTag(action, 'a');
    expect(inputText.length).toEqual(1);
  });

  it('Can render an icon', function() {
    var action = TestUtils.renderIntoDocument(<Action {...fixture.config}/>);
    var dom = action.getDOMNode();
    expect(dom.childNodes[0].className).toEqual('glyphicon glyphicon-' + fixture.config.iconClass);
  });

});
