var React = require('react');
var Components = require('../../src/main');
var TestUtils = require('react/lib/ReactTestUtils');
var Form = Components.elements.form;
var fixture = require('../fixtures/form.json');

describe('Form component', function() {
 
  it('Renders form container', function(){
    var formPage = TestUtils.renderIntoDocument(<Form {...fixture.config}/>);
    var inputText = TestUtils.scryRenderedDOMComponentsWithTag(formPage, 'form');
    expect(inputText.length).toEqual(1);    
  });
  
  it('can render a fieldset', function(){    
    var Form = Components.factory(fixture);
    var form = TestUtils.renderIntoDocument(Form);
    
    expect(TestUtils.scryRenderedDOMComponentsWithTag(form, 'fieldset').length).toEqual(1);
    expect(TestUtils.scryRenderedDOMComponentsWithTag(form, 'input').length).toEqual(1);
  });
});
