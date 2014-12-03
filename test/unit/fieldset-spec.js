describe('Fieldset component', function() {
  var tu = React.addons.TestUtils;

  var fieldsetFixture = {
    type: 'fieldset',
    config: {
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
    }
  };

  it('Renders fieldset legend', function(){
    var Fieldset = Components.factory(fieldsetFixture);
    var fieldset = tu.renderIntoDocument(Fieldset);
    var legend = tu.findRenderedDOMComponentWithTag(fieldset, 'legend');
    expect(legend.getDOMNode().textContent).toEqual(fieldsetFixture.config.name);
  });

  it('Renders fieldset container', function(){
    var Fieldset = Components.factory(fieldsetFixture);
    var fieldset = tu.renderIntoDocument(Fieldset);
    var inputText = tu.scryRenderedDOMComponentsWithTag(fieldset, 'fieldset');
    expect(inputText.length).toEqual(1);    
  });

  it('Renders fieldset fields', function(){
    var Fieldset = Components.factory(fieldsetFixture);
    var fieldset = tu.renderIntoDocument(Fieldset);
    var inputText = tu.scryRenderedDOMComponentsWithTag(fieldset, 'input');
    expect(inputText.length).toEqual(fieldsetFixture.config.components.length);
    inputText.forEach(function(elm, j){
      expect(elm.getDOMNode().type).toEqual(fieldsetFixture.config.components[j].config.type);
    });        
  });  
  
});
