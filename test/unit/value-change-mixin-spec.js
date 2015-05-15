var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('../../src/constants');
var TestUtils = require('react/lib/ReactTestUtils');
var Field = require('../../src/Field');

describe('ValueChangeMixin', function() {

  it('can send data payload with field values on user change via FIELD_VALUE_CHANGE', function(done) {
    var textFieldConfig = {
      id: 'test-text',
      name: 'testText',
      label: 'Test',
      type: 'text',
      value: ''
    };
    var dom = TestUtils.renderIntoDocument(<Field {...textFieldConfig}/>);
    var wrapperDiv = dom.getDOMNode();
    var input = wrapperDiv.childNodes[2];

    Dispatcher.register( 'test-field-value-change', function(action, data) {
      if( action === constants.actions.FIELD_VALUE_CHANGE &&
          data.id === textFieldConfig.id) {
        Dispatcher.unregister('test-field-value-change');
        expect(data.id).toEqual(textFieldConfig.id);
        expect(data.name).toEqual(textFieldConfig.name);
        expect(data.type).toEqual(textFieldConfig.type);
        expect(data.value).toEqual('value test');
        done();
      }
    });
    TestUtils.Simulate.change(input, {target: {value: 'value test'}});

  });

  it('optionally can send data payload on user change via custom action instead of FIELD_VALUE_CHANGE', function(done) {
    var textFieldConfig = {
      id: 'test-text',
      name: 'testText',
      type: 'text',
      label: 'Test',
      value: ''
    };
    var dom = TestUtils.renderIntoDocument(<Field {...textFieldConfig} fieldValueChangeAction="custom-field-value-change-action"/>);
    var wrapperDiv = dom.getDOMNode();
    var input = wrapperDiv.childNodes[2];

    Dispatcher.register( 'custom-field-value-change-action-event', function(action, data) {
      if( action === 'custom-field-value-change-action' &&
          data.id === textFieldConfig.id) {
        Dispatcher.unregister('custom-field-value-change-action-event');
        expect(data.id).toEqual(textFieldConfig.id);
        expect(data.name).toEqual(textFieldConfig.name);
        expect(data.type).toEqual(textFieldConfig.type);
        expect(data.value).toEqual('custom action value test');
      }
      setTimeout(function() {
        expect(action).toEqual('custom-field-value-change-action');
        expect(action).not.toEqual(constants.actions.FIELD_VALUE_CHANGE);
        done();
      }, 300);
    });
    TestUtils.Simulate.change(input, {target: {value: 'custom action value test'}});
  });

});
