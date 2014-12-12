describe('Fieldset component', function() {
  var tu = React.addons.TestUtils;
  var fixture = require('../fixtures/fieldset.json');

  it('Renders fieldset legend', function(){
    var Fieldset = Components.factory(fixture);
    var fieldset = tu.renderIntoDocument(Fieldset);
    var legend = tu.findRenderedDOMComponentWithTag(fieldset, 'legend');
    expect(legend.getDOMNode().textContent).toEqual(fixture.config.name);
  });

  it('Renders fieldset container', function(){
    var Fieldset = Components.factory(fixture);
    var fieldset = tu.renderIntoDocument(Fieldset);
    var inputText = tu.scryRenderedDOMComponentsWithTag(fieldset, 'fieldset');
    expect(inputText.length).toEqual(1);    
  });

  it('Renders fieldset fields', function(){
    var Fieldset = Components.factory(fixture);
    var fieldset = tu.renderIntoDocument(Fieldset);
    var inputText = tu.scryRenderedDOMComponentsWithTag(fieldset, 'input');
    expect(inputText.length).toEqual(Object.keys(fixture.components).length);
  });  
  
});
