describe('Field component', function() {
  var Field = React.createFactory(Components.elements.field);
  var tu = React.addons.TestUtils;

  var textFixture = require('../fixtures/field-text.json');

  it('Renders text label', function(){
    var field = tu.renderIntoDocument(Field(textFixture));
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(textFixture.label);
  });

  it('Renders text field', function(){
    var field = tu.renderIntoDocument(Field(textFixture));
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputText.getDOMNode().type).toEqual(textFixture.type);
  });

  var textareaFixture = require('../fixtures/field-textarea.json');

  it('Renders textarea label', function(){
    var field = tu.renderIntoDocument(Field(textareaFixture));
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(textareaFixture.label);
  });

  it('Renders textarea field', function(){
    var field = tu.renderIntoDocument(Field(textareaFixture));
    var inputTextarea = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputTextarea.getDOMNode().type).toEqual(textareaFixture.type);
  });  

  var checkboxFixture = require('../fixtures/field-checkbox.json');

  it('Renders checkbox field wrapped in a fieldset', function(){
    var field = tu.renderIntoDocument(Field(checkboxFixture));
    var fieldset = tu.scryRenderedDOMComponentsWithTag(field, 'fieldset');
    expect(fieldset.length).toEqual(1);    
  });  

  it('Renders checkbox legend', function(){
    var field = tu.renderIntoDocument(Field(checkboxFixture));
    var legend = tu.findRenderedDOMComponentWithTag(field, 'legend');
    expect(legend.getDOMNode().textContent).toEqual(checkboxFixture.label);          
  });

  it('Renders checkbox fields', function(){
    var field = tu.renderIntoDocument(Field(checkboxFixture));
    // Check that each input count and item count match
    var inputs = tu.scryRenderedDOMComponentsWithTag(field, 'input');
    expect(inputs.length).toEqual(checkboxFixture.options.items.length); 
    // Each input should have it's own label
    var inputLabels = tu.scryRenderedDOMComponentsWithTag(field, 'label');
    inputLabels.forEach(function(label,i){
      expect(label.getDOMNode().textContent).toEqual(checkboxFixture.options.items[i].label);     
    });    
  });

  it('Can get value of Checkbox', function(){
    document.body.innerHTML = '<div id="test-page"></div>';
    React.render(Field(checkboxFixture),document.getElementById('test-page'));
    expect(document.getElementsByClassName('field').length).toEqual(2);
    expect((document.getElementsByClassName('field')[0]).checked).toEqual(false);
    (document.getElementsByClassName('field')[0]).click();
    expect((document.getElementsByClassName('field')[0]).checked).toEqual(true);
    (document.getElementsByClassName('field')[0]).click();
    expect((document.getElementsByClassName('field')[0]).checked).toEqual(false);
  });

  var radioFixture = require('../fixtures/field-radio.json');

  it('Renders radio field wrapped in a fieldset', function(){
    var field = tu.renderIntoDocument(Field(radioFixture));
    var fieldset = tu.scryRenderedDOMComponentsWithTag(field, 'fieldset');
    expect(fieldset.length).toEqual(1);    
  }); 

  it('Renders radio legend', function(){
    var field = tu.renderIntoDocument(Field(radioFixture));
    var legend = tu.findRenderedDOMComponentWithTag(field, 'legend');
    expect(legend.getDOMNode().textContent).toEqual(radioFixture.label);          
  });

  it('Renders radio fields', function(){
    var field = tu.renderIntoDocument(Field(radioFixture));
    // Check that each input count and item count match
    var inputs = tu.scryRenderedDOMComponentsWithTag(field, 'input');
    expect(inputs.length).toEqual(radioFixture.options.items.length);
    // Each input should have it's own label
    var inputLabels = tu.scryRenderedDOMComponentsWithTag(field, 'label');
    inputLabels.forEach(function(label,i){
      expect(label.getDOMNode().textContent).toEqual(radioFixture.options.items[i].label);
    });
  });

  it('Can get value of Radio', function(){
    document.body.innerHTML = '<div id="test-page"></div>';
    React.render(Field(radioFixture),document.getElementById('test-page'));
    expect(document.getElementsByClassName('field').length).toEqual(2);
    expect((document.getElementsByClassName('field')[0]).checked).toEqual(false);
    (document.getElementsByClassName('field')[0]).click();
    expect((document.getElementsByClassName('field')[0]).checked).toEqual(true);
    (document.getElementsByClassName('field')[1]).click();
    expect((document.getElementsByClassName('field')[0]).checked).toEqual(false);
  });

  var selectFixture = require('../fixtures/field-select.json');

  it('Renders select label', function(){
    var field = tu.renderIntoDocument(Field(selectFixture));
    var label = tu.findRenderedDOMComponentWithClass(field, 'field-label');
    expect(label.getDOMNode().textContent).toEqual(selectFixture.label);          
  });

  it('Renders select field', function(){
    var field = tu.renderIntoDocument(Field(selectFixture));
    var inputSelect = tu.findRenderedDOMComponentWithTag(field, 'select');
    expect(inputSelect.getDOMNode().value).toEqual(selectFixture.options.items[0].value);   // Defaults to first value, so compare first values
  });

  var multiselectFixture = require('../fixtures/field-multiselect.json');

  it('Renders multiselect label', function(){
    var field = tu.renderIntoDocument(Field(multiselectFixture));
    var label = tu.findRenderedDOMComponentWithClass(field, 'field-label');
    expect(label.getDOMNode().textContent).toEqual(multiselectFixture.label);          
  });

  it('Renders multiselect field', function(){
    var field = tu.renderIntoDocument(Field(multiselectFixture));
    var inputSelect = tu.findRenderedDOMComponentWithTag(field, 'select');
    expect(inputSelect.getDOMNode().multiple).toEqual(true);   // Defaults to first value, so compare first values
  });    

  var emailFixture = require('../fixtures/field-email.json');

  it('Renders email label', function(){
    var field = tu.renderIntoDocument(Field(emailFixture));
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(emailFixture.label);
  });

  it('Renders email field', function(){
    var field = tu.renderIntoDocument(Field(emailFixture));
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputText.getDOMNode().type).toEqual(emailFixture.type);
  }); 

  var phoneFixture = require('../fixtures/field-phone.json');

  it('Renders phone label', function(){
    var field = tu.renderIntoDocument(Field(phoneFixture));
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(phoneFixture.label);
  });

  it('Renders phone field', function(){
    var field = tu.renderIntoDocument(Field(phoneFixture));
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputText.getDOMNode().type).toEqual(phoneFixture.type); 
  });  

  var dateFixture = require('../fixtures/field-date.json');

  it('Renders date label', function(){
    var field = tu.renderIntoDocument(Field(dateFixture));
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(dateFixture.label);
  });

  it('Renders date field', function(){
    var field = tu.renderIntoDocument(Field(dateFixture));
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputText.getDOMNode().type).toEqual(dateFixture.type);
  });  

  var passwordFixture = require('../fixtures/field-password.json');

  it('Renders password label', function(){
    var field = tu.renderIntoDocument(Field(passwordFixture));
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(passwordFixture.label);
  });

  it('Renders password field', function(){
    var field = tu.renderIntoDocument(Field(passwordFixture));
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputText.getDOMNode().type).toEqual(passwordFixture.type);
  }); 

  var requiredFixture = require('../fixtures/field-required.json');

  it('Renders required asterisk in label', function(){
    var field = tu.renderIntoDocument(Field(requiredFixture));
    var errorAst = tu.findRenderedDOMComponentWithClass(field, 'text-danger');
    expect(errorAst.getDOMNode().textContent).toEqual('*');
  });  

});
