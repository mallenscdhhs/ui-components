var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('../../src/constants');
var TestUtils = require('react/lib/ReactTestUtils');
var Field = require('../../src/Field');

var textFieldConfig = {
  id: 'testText',
  name: 'testText',
  label: 'Test Text',
  type: 'text',
  value: 'ten'
};

var checkboxFieldConfig = {
  id: 'testCheckbox',
  name: 'testCheckbox',
  label: 'Test Checkbox',
  type: 'checkbox',
  value: ['two','one'],
  options: [{'label':'one','value':'one'},{'label':'two','value':'two'}]
};

describe('FieldValueMixin', function(){


  it('send field value for text field', function(done){
    var textField = TestUtils.renderIntoDocument(<Field {...textFieldConfig}/>);

    Dispatcher.register( 'TEST-FIELD-SEND-VALUE-TEXT' , function(action,data){
      if( action === constants.actions.FIELD_VALUE &&
          data.id === textFieldConfig.id) {
        expect(data.value).toEqual(textFieldConfig.value);
        expect(data.id).toEqual(textFieldConfig.id);
        expect(data.name).toEqual(textFieldConfig.name);
        done();
        Dispatcher.unregister('TEST-FIELD-SEND-VALUE-TEXT');
      }
    });

    Flux.doAction(constants.actions.GET_FIELD_VALUE, {'id':textFieldConfig.id});
  });

  it('send field value for checkbox field', function(done){

    var checkboxField = TestUtils.renderIntoDocument(<Field {...checkboxFieldConfig}/>);

    Dispatcher.register( 'TEST-FIELD-SEND-VALUE-CHECKBOX' , function(action,data){
      if( action === constants.actions.FIELD_VALUE &&
          data.id === checkboxFieldConfig.id) {
        expect(data.value).toEqual(checkboxFieldConfig.value);
        expect(data.id).toEqual(checkboxFieldConfig.id);
        expect(data.name).toEqual(checkboxFieldConfig.name);
        done();
        Dispatcher.unregister('TEST-FIELD-SEND-VALUE-CHECKBOX');
      }
    });

    Flux.doAction(constants.actions.GET_FIELD_VALUE, {'id':checkboxFieldConfig.id});
  });

});
