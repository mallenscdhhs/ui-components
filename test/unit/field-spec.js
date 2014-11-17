var React = require('react/addons');
var Field = require('../../dist/cjs/Field');
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

  it('Renders checkbox field wrapped in a fieldset', function(){
    var field = tu.renderIntoDocument(<Field {...checkboxFixture}/>);
    var fieldset = tu.scryRenderedDOMComponentsWithTag(field, 'fieldset');
    expect(fieldset.length).toEqual(1);    
  });  

  it('Renders checkbox legend', function(){
    var field = tu.renderIntoDocument(<Field {...checkboxFixture}/>);
    var legend = tu.findRenderedDOMComponentWithTag(field, 'legend');
    expect(legend.getDOMNode().textContent).toEqual(checkboxFixture.label);          
  });

  it('Renders checkbox fields', function(){
    var field = tu.renderIntoDocument(<Field {...checkboxFixture}/>);
    // Check that each input count and item count match
    var inputs = tu.scryRenderedDOMComponentsWithTag(field, 'input');
    expect(inputs.length).toEqual(checkboxFixture.options.items.length); 
    // Each input should have it's own label
    var inputLabels = tu.scryRenderedDOMComponentsWithTag(field, 'label');
    _.each(inputLabels,function(label,i){
      expect(label.getDOMNode().textContent).toEqual(checkboxFixture.options.items[i].label);     
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

  it('Renders radio field wrapped in a fieldset', function(){
    var field = tu.renderIntoDocument(<Field {...radioFixture}/>);
    var fieldset = tu.scryRenderedDOMComponentsWithTag(field, 'fieldset');
    expect(fieldset.length).toEqual(1);    
  }); 

  it('Renders radio legend', function(){
    var field = tu.renderIntoDocument(<Field {...radioFixture}/>);
    var legend = tu.findRenderedDOMComponentWithTag(field, 'legend');
    expect(legend.getDOMNode().textContent).toEqual(radioFixture.label);          
  });

  it('Renders radio fields', function(){
    var field = tu.renderIntoDocument(<Field {...radioFixture}/>);
    // Check that each input count and item count match
    var inputs = tu.scryRenderedDOMComponentsWithTag(field, 'input');
    expect(inputs.length).toEqual(radioFixture.options.items.length); 
    // Each input should have it's own label
    var inputLabels = tu.scryRenderedDOMComponentsWithTag(field, 'label');
    _.each(inputLabels,function(label,i){
      expect(label.getDOMNode().textContent).toEqual(radioFixture.options.items[i].label);     
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

  var multiselectFixture = {
    type : 'multiselect',
    name : 'test-multiselect',
    label : 'Test Multi-Select',
    required : false,
    options : {
      'items' : [
        {
          'label' : 'Multi-Select 1',
          'value' : '1'
        },
        {
          'label' : 'Multi-Select 2',
          'value' : '2'
        }        
      ]
    }
  };

  it('Renders multiselect label', function(){
    var field = tu.renderIntoDocument(<Field {...multiselectFixture}/>);
    var label = tu.findRenderedDOMComponentWithClass(field, 'field-label');
    expect(label.getDOMNode().textContent).toEqual(multiselectFixture.label);          
  });

  it('Renders multiselect field', function(){
    var field = tu.renderIntoDocument(<Field {...multiselectFixture}/>);
    var inputSelect = tu.findRenderedDOMComponentWithTag(field, 'select');
    expect(inputSelect.getDOMNode().multiple).toEqual(true);   // Defaults to first value, so compare first values
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
    type : 'tel',
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
    expect(inputText.getDOMNode().type).toEqual(phoneFixture.type); 
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

  var requiredFixture = {
    type : 'text',
    name : 'test-required',
    label : 'Required Text',
    required : true,
    options : { }
  };

  it('Renders required asterisk in label', function(){
    var field = tu.renderIntoDocument(<Field {...requiredFixture}/>);
    var errorAst = tu.findRenderedDOMComponentWithTag(field, 'span');
    expect(errorAst.getDOMNode().className).toEqual('text-danger');
    expect(errorAst.getDOMNode().textContent).toEqual('*');
  });  

});
