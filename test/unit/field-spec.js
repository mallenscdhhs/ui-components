var React = require('react/addons');
var Field = require('../../src/Field.jsx');
var request = require('superagent');
var tu = React.addons.TestUtils;

describe('Field component', function() {

  var textFixture = {
    type : 'text',
    name : 'test-text',
    label : 'Test Text',
    required : false,
    options : { }
  };

  it('Renders text label', function(){
    var field = tu.renderIntoDocument(<Field {...textFixture}/>);
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(textFixture.label);
  });

  it('Renders text field', function(){
    var field = tu.renderIntoDocument(<Field {...textFixture}/>);
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputText.getDOMNode().type).toEqual(textFixture.type);
  });

  var textareaFixture = {
    type : 'textarea',
    name : 'test-textarea',
    label : 'Test Textarea',
    required : false,
    options : { }
  };

  it('Renders textarea label', function(){
    var field = tu.renderIntoDocument(<Field {...textareaFixture}/>);
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(textareaFixture.label);
  });

  it('Renders textarea field', function(){
    var field = tu.renderIntoDocument(<Field {...textareaFixture}/>);
    var inputTextarea = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputTextarea.getDOMNode().type).toEqual(textareaFixture.type);
  });  


  var checkboxFixture = {
    type : 'checkbox',
    name : 'test-checkbox',
    label : 'Test Checkbox',
    required : false,
    options : {
      'items' : [
        {
          'label' : 'Checkbox 1',
          'value' : '1'
        },
        {
          'label' : 'Checkbox 2',
          'value' : '2'
        }        
      ]
    }
  };

  it('Renders checkbox label', function(){
    var field = tu.renderIntoDocument(<Field {...checkboxFixture}/>);
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(checkboxFixture.label);
  });

  it('Renders checkbox field', function(){
    var field = tu.renderIntoDocument(<Field {...checkboxFixture}/>);
    var inputCheckbox = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputCheckbox.getDOMNode().type).toEqual(checkboxFixture.type);
  });   

});
