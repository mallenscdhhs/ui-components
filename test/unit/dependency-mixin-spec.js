var React = require('react');
var Field = require('../../src/Field');
var Fieldset = require('../../src/Fieldset');
var Flux = require('fluxify');
var constants = require('../../src/constants');
var Dispatcher = Flux.Dispatcher;
var TestUtils = require('react/lib/ReactTestUtils');

var config = {
  id: 'test',
  name: 'test',
  label: 'Test',
  type: 'text',
  dependencyName: 'dep-mixin-test',
  dependencyValue: 'bar|baz',
  initialState: 'hidden'
};

describe('DependencyMixin', function(){
  var field;
  beforeEach(function(){
    field = TestUtils.renderIntoDocument(<Field {...config}/>);
  });

  it('can update a field\'s visibility when a dependent field changes its value', function(done){
    expect(field.state.visible).toEqual(false);
    Flux.doAction(constants.actions.FIELD_VALUE_CHANGE, {name: 'dep-mixin-test', value: 'bar'})
      .then(function(){
        expect(field.state.visible).toEqual(true);
        done();
      });
  });

  // simulates listening for value change on a checkbox group, which has an Array as its value
  it('can determine if a field\'s state should change when a list of values are sent', function(done){
    expect(field.state.visible).toEqual(false);
    Flux.doAction(constants.actions.FIELD_VALUE_CHANGE, {name: 'dep-mixin-test', value: ['boop', 'bar']})
      .then(function(){
        expect(field.state.visible).toEqual(true);
        done();
      });
  });
  
  it('determine if a field should be visible based on initial value of dependent field', function(done){
    expect(field.state.visible).toEqual(false);
    Flux.doAction(constants.actions.FIELD_VALUE, {name: 'dep-mixin-test', value: ['boop', 'bar']})
      .then(function(){
        expect(field.state.visible).toEqual(true);
        done();
      });
  });

  it('can update a fieldset\'s visibility when a dependent field changes its value', function(done){
    var fieldset = TestUtils.renderIntoDocument(<Fieldset {...config}/>);
    expect(fieldset.state.visible).toEqual(false);
    Flux.doAction(constants.actions.FIELD_VALUE_CHANGE, {name: 'dep-mixin-test', value: 'bar'})
      .then(function(){
        expect(fieldset.state.visible).toEqual(true);
        done();
      });
  });

});
