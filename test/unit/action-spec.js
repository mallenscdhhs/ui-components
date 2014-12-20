describe('Action component', function() {    
  var tu = React.addons.TestUtils;	
  var fixture = require('../fixtures/action.json');

  it('Renders action', function(){
    var Action = Components.elements['action'];
    var action = tu.renderIntoDocument(<Action {...fixture.config}/>);
    var inputText = tu.scryRenderedDOMComponentsWithTag(action, 'a');
    expect(inputText.length).toEqual(1);    
  });
});
