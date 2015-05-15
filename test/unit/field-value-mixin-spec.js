var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('../../src/constants');
var TestUtils = require('react/lib/ReactTestUtils');
var Field = require('../../src/Field');

describe('FieldValueMixin', function(){

  it('send field value for text field', function(done){

    var textFieldConfig = {
      id: 'testText',
      name: 'testText',
      label: 'Test Text',
      type: 'text',
      value: 'ten'
    };

    var textField = TestUtils.renderIntoDocument(<Field {...textFieldConfig}/>);

    Dispatcher.register('TEST-FIELD-SEND-VALUE-TEXT', function(action, data){
      if( action === constants.actions.FIELD_VALUE && data.id === textFieldConfig.id) {
        Dispatcher.unregister('TEST-FIELD-SEND-VALUE-TEXT');
        expect(data.value).toEqual(textFieldConfig.value);
        expect(data.id).toEqual(textFieldConfig.id);
        expect(data.name).toEqual(textFieldConfig.name);
        done();
      }
    });

    Flux.doAction(constants.actions.GET_FIELD_VALUE, {'id':textFieldConfig.id});
  });

  it('send field value for checkbox field as fieldGroup', function(done){

    var checkboxFieldConfig = {
      id: 'testCheckbox',
      name: 'testCheckbox',
      label: 'Test Checkbox',
      type: 'checkbox',
      value: ['one','two'],
      options: [{'label':'one','value':'one'},{'label':'two','value':'two'}]
    };

    var checkboxField = TestUtils.renderIntoDocument(<Field {...checkboxFieldConfig}/>);

    Dispatcher.register( 'TEST-FIELD-SEND-VALUE-CHECKBOX' , function(action,data){
      if( action === constants.actions.FIELD_VALUE &&
          data.id === checkboxFieldConfig.id) {
        Dispatcher.unregister('TEST-FIELD-SEND-VALUE-CHECKBOX');
        expect(data.value).toEqual(checkboxFieldConfig.value);
        expect(data.id).toEqual(checkboxFieldConfig.id);
        expect(data.name).toEqual(checkboxFieldConfig.name);
        done();
      }
    });

    Flux.doAction(constants.actions.GET_FIELD_VALUE, {'id':checkboxFieldConfig.id});
  });

  it('send field value for checkbox field as checkable that is checked', function(done){

    var checkboxCheckableFieldConfig = {
      id: 'testCheckboxCheckable',
      name: 'testCheckboxCheckable',
      label: 'Test Checkbox',
      type: 'checkbox',
      value: "one",
      checked : true
    };

    var checkboxCheckableField = TestUtils.renderIntoDocument(<Field {...checkboxCheckableFieldConfig}/>);

    Dispatcher.register( 'TEST-FIELD-SEND-VALUE-CHECKBOX-CHECKABLE' , function(action,data){
      if( action === constants.actions.FIELD_VALUE &&
          data.id === checkboxCheckableFieldConfig.id) {
        Dispatcher.unregister('TEST-FIELD-SEND-VALUE-CHECKBOX-CHECKABLE');
        expect(data.value).toEqual(checkboxCheckableFieldConfig.value);
        expect(data.id).toEqual(checkboxCheckableFieldConfig.id);
        expect(data.name).toEqual(checkboxCheckableFieldConfig.name);
        done();
      }
    });

    Flux.doAction(constants.actions.GET_FIELD_VALUE, {'id':checkboxCheckableFieldConfig.id});
  });

  it('send field value for checkbox field as checkable that is NOT checked', function(done){

    var checkboxCheckableFieldNotCheckedConfig = {
      id: 'testCheckboxCheckableNot',
      name: 'testCheckboxCheckableNot',
      label: 'Test Checkbox Not',
      type: 'checkbox',
      value: "two",
      checked : false
    };

    var checkboxCheckableNotCheckedField = TestUtils.renderIntoDocument(<Field {...checkboxCheckableFieldNotCheckedConfig}/>);

    Dispatcher.register( 'TEST-FIELD-SEND-VALUE-CHECKBOX-CHECKABLE-NOT-CHECKED' , function(action,data){
      if( action === constants.actions.FIELD_VALUE &&
          data.id === checkboxCheckableFieldNotCheckedConfig.id) {
        Dispatcher.unregister('TEST-FIELD-SEND-VALUE-CHECKBOX-CHECKABLE-NOT-CHECKED');
        expect(data.value).toEqual(null);
        expect(data.id).toEqual(checkboxCheckableFieldNotCheckedConfig.id);
        expect(data.name).toEqual(checkboxCheckableFieldNotCheckedConfig.name);
        done();
      }
    });

    Flux.doAction(constants.actions.GET_FIELD_VALUE, {'id':checkboxCheckableFieldNotCheckedConfig.id});
  });

  it('send field value for radio', function(done){

    var radioConfig = {
      id: 'testRadio',
      name: 'Radio',
      label: 'Test Radio',
      type: 'radio',
      value: "two",
      options: [{'label':'one','value':'one'},{'label':'two','value':'two'}]
    };

    var radioField = TestUtils.renderIntoDocument(<Field {...radioConfig}/>);

    Dispatcher.register( 'TEST-FIELD-SEND-VALUE-RADIO' , function(action,data){
      if( action === constants.actions.FIELD_VALUE &&
          data.id === radioConfig.id) {
        Dispatcher.unregister('TEST-FIELD-SEND-VALUE-RADIO');
        expect(data.value).toEqual(radioConfig.value);
        expect(data.id).toEqual(radioConfig.id);
        expect(data.name).toEqual(radioConfig.name);
        done();
      }
    });

    Flux.doAction(constants.actions.GET_FIELD_VALUE, {'id':radioConfig.id});
  });

});
