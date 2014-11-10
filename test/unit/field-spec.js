var React = require('react/addons');
var Field = require('../../src/Field.jsx');
var request = require('superagent');
var _ = require('underscore');
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

  it('Renders checkbox labels', function(){
    var field = tu.renderIntoDocument(<Field {...checkboxFixture}/>);
    var label = tu.findRenderedDOMComponentWithClass(field, 'field-label');
    expect(label.getDOMNode().textContent).toEqual(checkboxFixture.label);          
  });

  it('Renders checkbox fields', function(){
    var field = tu.renderIntoDocument(<Field {...checkboxFixture}/>);
    var inputCheckboxes = tu.scryRenderedDOMComponentsWithClass(field, 'form-control');
    _.each(inputCheckboxes,function(checkbox,i){
      expect(checkbox.getDOMNode().value).toEqual(checkboxFixture.options.items[i].value);     
    });    
  }); 

  var radioFixture = {
    type : 'radio',
    name : 'test-radio',
    label : 'Test Radio',
    required : false,
    options : {
      'items' : [
        {
          'label' : 'Radio 1',
          'value' : '1'
        },
        {
          'label' : 'Radio 2',
          'value' : '2'
        }        
      ]
    }
  };

  it('Renders radio labels', function(){
    var field = tu.renderIntoDocument(<Field {...radioFixture}/>);
    var label = tu.findRenderedDOMComponentWithClass(field, 'field-label');
    expect(label.getDOMNode().textContent).toEqual(radioFixture.label);          
  });

  it('Renders radio fields', function(){
    var field = tu.renderIntoDocument(<Field {...radioFixture}/>);
    var inputRadios = tu.scryRenderedDOMComponentsWithClass(field, 'form-control');
    _.each(inputRadios,function(radio,i){
      expect(radio.getDOMNode().value).toEqual(radioFixture.options.items[i].value);     
    });    
  });     

});
