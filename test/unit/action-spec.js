describe('Action component', function() {    
  var tu = React.addons.TestUtils;	
  var actionFixture = {
    type: 'action',
    config: {
      'name' : 'Test Form',
      'url' : 'testing.html',
      'id' : 'action-test-1'
    }    
  };

  it('Renders action', function(){
    var Action = Components.elements['action'];
    var action = tu.renderIntoDocument(<Action {...actionFixture.config}/>);
    var inputText = tu.scryRenderedDOMComponentsWithTag(action, 'a');
    expect(inputText.length).toEqual(1);    
  });

});
