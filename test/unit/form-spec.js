describe('Form component', function() {
  var tu = React.addons.TestUtils;
  var Form = Components.elements.form;
  var fixture = require('../fixtures/form.json');

  it('Renders form container', function(){
    var formPage = tu.renderIntoDocument(<Form {...fixture.config}/>);
    var inputText = tu.scryRenderedDOMComponentsWithTag(formPage, 'form');
    expect(inputText.length).toEqual(1);    
  });
  
  it('can render a fieldset', function(){    
    var Form = Components.factory(fixture);
    var form = tu.renderIntoDocument(Form);
    
    expect(tu.scryRenderedDOMComponentsWithTag(form, 'fieldset').length).toEqual(1);
    expect(tu.scryRenderedDOMComponentsWithTag(form, 'input').length).toEqual(1);
  });
});
