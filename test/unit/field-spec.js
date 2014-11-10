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

  var selectFixture = {
    type : 'select',
    name : 'test-select',
    label : 'Test Select',
    required : false,
    options : {
      'items' : [
        {
          'label' : 'Select 1',
          'value' : '1'
        },
        {
          'label' : 'Select 2',
          'value' : '2'
        }        
      ]
    }
  };

  it('Renders select label', function(){
    var field = tu.renderIntoDocument(<Field {...selectFixture}/>);
    var label = tu.findRenderedDOMComponentWithClass(field, 'field-label');
    expect(label.getDOMNode().textContent).toEqual(selectFixture.label);          
  });

  it('Renders select field', function(){
    var field = tu.renderIntoDocument(<Field {...selectFixture}/>);
    var inputSelect = tu.findRenderedDOMComponentWithTag(field, 'select');
    expect(inputSelect.getDOMNode().value).toEqual(selectFixture.options.items[0].value);   // Defaults to first value, so compare first values
  });     

  var emailFixture = {
    type : 'email',
    name : 'test-email',
    label : 'Test Email',
    required : false,
    options : { }
  };

  it('Renders email label', function(){
    var field = tu.renderIntoDocument(<Field {...emailFixture}/>);
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(emailFixture.label);
  });

  it('Renders email field', function(){
    var field = tu.renderIntoDocument(<Field {...emailFixture}/>);
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputText.getDOMNode().type).toEqual(emailFixture.type);
  }); 

  var phoneFixture = {
    type : 'phone',
    name : 'test-phone',
    label : 'Test Phone',
    required : false,
    options : { }
  };

  it('Renders phone label', function(){
    var field = tu.renderIntoDocument(<Field {...phoneFixture}/>);
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(phoneFixture.label);
  });

  it('Renders phone field', function(){
    var field = tu.renderIntoDocument(<Field {...phoneFixture}/>);
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputText.getDOMNode().type).toEqual('tel'); // custom mapping from 'phone' type to 'tel', so test for tel
  });  

  var dateFixture = {
    type : 'date',
    name : 'test-date',
    label : 'Test Date',
    required : false,
    options : { }
  };

  it('Renders date label', function(){
    var field = tu.renderIntoDocument(<Field {...dateFixture}/>);
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(dateFixture.label);
  });

  it('Renders date field', function(){
    var field = tu.renderIntoDocument(<Field {...dateFixture}/>);
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputText.getDOMNode().type).toEqual(dateFixture.type);
  });  

  var passwordFixture = {
    type : 'password',
    name : 'test-password',
    label : 'Test Password',
    required : false,
    options : { }
  };

  it('Renders password label', function(){
    var field = tu.renderIntoDocument(<Field {...passwordFixture}/>);
    var label = tu.findRenderedDOMComponentWithTag(field, 'label');
    expect(label.getDOMNode().textContent).toEqual(passwordFixture.label);
  });

  it('Renders password field', function(){
    var field = tu.renderIntoDocument(<Field {...passwordFixture}/>);
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'form-control');
    expect(inputText.getDOMNode().type).toEqual(passwordFixture.type);
  }); 

});
