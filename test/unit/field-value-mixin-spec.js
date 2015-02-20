var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('../../src/constants');
var TestUtils = require('react/lib/ReactTestUtils');
var Field = require('../../src/Field');

var fieldTest = {
  id: 'test',
  name: 'test',
  label: 'Test',
  type: 'text',
  value: 'testValue'
};

describe('FieldValueMixin', function(){
  var field;
  beforeEach(function(){
    field = TestUtils.renderIntoDocument(<Field {...fieldTest}/>);
  });

  it('send field value', function(done){

    Dispatcher.register( 'TEST-FIELD-SEND-VALUE' , function(action,data){
      if( action === constants.actions.FIELD_VALUE &&
          data.id === fieldTest.id) {
        expect(data.value).toEqual(fieldTest.value);
        expect(data.id).toEqual(fieldTest.id);
        expect(data.name).toEqual(fieldTest.name);
        done();
        Dispatcher.unregister('TEST-FIELD-SEND-VALUE');
      }
    });

    Flux.doAction(constants.actions.GET_FIELD_VALUE, {'id':fieldTest.id});
  });

});
