var React = require('react/addons');
var Action = require('../../dist/cjs/Action');
var tu = React.addons.TestUtils;

describe('Action component', function() {

  var actionFixture = {
    'name' : 'Test Form',
    'url' : 'testing.html'
  };

  it('Renders action', function(){
    var action = tu.renderIntoDocument(<Action {...actionFixture}/>);
    var inputText = tu.scryRenderedDOMComponentsWithTag(action, 'a');
    expect(inputText.length).toEqual(1);    
  });

});
