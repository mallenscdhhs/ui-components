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

});
