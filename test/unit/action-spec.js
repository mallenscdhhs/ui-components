describe('Action component', function() {    
  var tu = React.addons.TestUtils;	
  var actionFixture = {
    type: 'action',
    config: {
      'name' : 'Test Form',
      'url' : 'testing.html'
    }    
  };

  it('Renders action', function(){
    var Action = Components.factory(actionFixture);
    var action = tu.renderIntoDocument(Action);
    var inputText = tu.scryRenderedDOMComponentsWithTag(action, 'a');
    expect(inputText.length).toEqual(1);    
  });

});
