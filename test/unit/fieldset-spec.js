describe('Fieldset component', function() {
  var Fieldset = React.createFactory(Components.elements.fieldset);
  var tu = React.addons.TestUtils;

  var fieldsetFixture = {
    'name' : 'Test Legend',
    'layout' : {
      type: "grid", 
      config: {
        rows: [[{md: '4', sm: '2'}]]
      }
    },
    'components' :[{
      'type' :'field',
      'config' : { 
        'type' : 'text',
        'name' : 'test-text',
        'label' : 'Test Text',
        'required' : false,
        'options' : { }
      }
    }]  
  };

  it('Renders fieldset legend', function(){
    var fieldset = tu.renderIntoDocument(Fieldset(fieldsetFixture));
    var legend = tu.findRenderedDOMComponentWithTag(fieldset, 'legend');
    expect(legend.getDOMNode().textContent).toEqual(fieldsetFixture.name);
  });

  it('Renders fieldset container', function(){
    var fieldset = tu.renderIntoDocument(Fieldset(fieldsetFixture));
    var inputText = tu.scryRenderedDOMComponentsWithTag(fieldset, 'fieldset');
    expect(inputText.length).toEqual(1);    
  });

  it('Renders fieldset fields', function(){
    var fieldset = tu.renderIntoDocument(Fieldset(fieldsetFixture));
    var inputText = tu.scryRenderedDOMComponentsWithTag(fieldset, 'input');
    expect(inputText.length).toEqual(fieldsetFixture.components.length);
    inputText.forEach(function(elm, j){
      expect(elm.getDOMNode().type).toEqual(fieldsetFixture.components[j].config.type);
    });        
  });  
  
});
