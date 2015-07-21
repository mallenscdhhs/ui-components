var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var utils = require('../../src/utils');
var Field = require('../../src/Field');

describe('utils', function(){
  describe('#containsOneOf', function(){
    it('will return "true" if a list contains a value from another list', function(){
      expect(utils.containsOneOf([1,2,3,4], [0,1])).toEqual(true);
      expect(utils.containsOneOf(["a", "b", "c"], ["AA", "B", "c"])).toEqual(true);
      expect(utils.containsOneOf(["1", "2"], ["1", "2"])).toEqual(true);
    });
    it('will return "false" if a list does not contain a value from another list', function(){
      expect(utils.containsOneOf([1,2,3], [0, 4])).toEqual(false);
      expect(utils.containsOneOf(['a', 'b', 'c'], ['A', 'bee'])).toEqual(false);
    });
  });

  describe('#getClasses', function(){
    var classesConfig = {
      type: 'button',
      classNames: ['btn', 'btn-primary', 'create-item-button'],
      disabled: false
    };

    it('will return custom classes from an array of strings in props.classNames', function(){
      expect( utils.getClasses(classesConfig) ).toEqual('btn btn-primary create-item-button');
    });
    it('will return the disabled class if props.disabled is truthy', function(){
      classesConfig.disabled = true;
      expect( utils.getClasses(classesConfig) ).toEqual('btn btn-primary create-item-button disabled');
    });
    it('will return the link class if props.type is link', function(){
      classesConfig = {type: 'link', classNames: ['create-item-link']};
      expect( utils.getClasses(classesConfig) ).toEqual('create-item-link link');
    });
  });

  describe('#getComputedInputAttr', function(){
    var fieldConfig = {
      id: 'first-name',
      name: 'first-name',
      label: 'First Name',
      type: 'input'
    };
    var dom = TestUtils.renderIntoDocument(<Field {...fieldConfig} {...utils.getComputedInputAttr('first-name')} />);
    var wrapperDiv = dom.getDOMNode();
    var input = wrapperDiv.childNodes[1];
    var helpBlock = wrapperDiv.childNodes[2];

    it('assigns form-control className', function(){
      expect(input.className).toEqual('form-control');
    });
    it('accepts the fieldId as an argument and assigns the proper aria-describedby attr to correspond with the help-block that follows the input', function(){
      expect(input.getAttribute('aria-describedby')).toEqual('first-name-help-block');
      expect(helpBlock.id).toEqual('first-name-help-block');
    });
  });
});
