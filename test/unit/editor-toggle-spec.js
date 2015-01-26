var React = require('react');
require('es6-promise').polyfill();
var Components = require('../../src/main');
var TestUtils = require('react/lib/ReactTestUtils');
var Dispatcher = require('fluxify').dispatcher;
var constants = require('../../src/constants');

var mockEvent = {
  stopPropagation: function(){},
  preventDefault: function(){}
};

describe('EditorToggle', function(){

  describe('edit-component button', function(){

    beforeEach(function(){
      this.fixture = {type: 'text', id:'test', name: 'test', label: 'test' ,componentType: 'field'};
      this.field = React.createFactory(Components.elements.field);
      this.component = TestUtils.renderIntoDocument(this.field(this.fixture));
    });

    it('will render the edit template', function(){
      var html = TestUtils.findRenderedDOMComponentWithClass(this.component, 'config-editor');
      expect(TestUtils.isDOMComponent(html)).toEqual(true);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'edit-component').length).toEqual(1);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'add-component').length).toEqual(0);
    });

    it('will publish a components props when "edit" is clicked', function(done){
      this.handler = function(){};
      var editComponent = TestUtils.findRenderedDOMComponentWithClass(this.component, 'edit-component');
      spyOn(this, 'handler');
      Dispatcher.register( 'TOGGLE-TEST-1', function(action,data){
        if( action === constants.actions.COMPONENT_EDIT) {
          this.handler(data);
          Dispatcher.unregister( 'TOGGLE-TEST-1');
        }
      }.bind(this));
      TestUtils.Simulate.click(editComponent);
      setTimeout(function(){
        expect(this.handler).toHaveBeenCalledWith(this.fixture);
        done();
      }.bind(this), 300);
    });

  });

  describe('add-component button', function(){

    beforeEach(function(){
      this.fixture = {type: 'page', title: 'Test page', content: 'testing', componentType: 'page'};
      this.page = React.createFactory(Components.elements.page);
      this.component = TestUtils.renderIntoDocument(this.page(this.fixture));
    });

    it('will render the add template', function(){
      var html = TestUtils.findRenderedDOMComponentWithClass(this.component, 'config-editor');
      expect(TestUtils.isDOMComponent(html)).toEqual(true);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'edit-component').length).toEqual(1);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'add-component').length).toEqual(1);
    });

    it('will publish a components props when "add" is clicked', function(done){
      this.handler = function(){};
      var btn = TestUtils.findRenderedDOMComponentWithClass(this.component, 'add-component');
      spyOn(this, 'handler');
      Dispatcher.register( 'TOGGLE-TEST-2', function(action,data){
        if( action === constants.actions.COMPONENT_ADD) {
          this.handler(data);
          Dispatcher.unregister( 'TOGGLE-TEST-2');
        }
      }.bind(this));
      TestUtils.Simulate.click(btn);
      setTimeout(function(){
        expect(this.handler).toHaveBeenCalledWith(this.fixture);
        done();
      }.bind(this), 300);
    });

  });


  describe('remove component button', function(){

    beforeEach(function(){
      this.fixture = {type: 'form', id:'test-form', componentType: 'form', name : 'testForm' };
      this.form = React.createFactory(Components.elements.form);
      this.component = TestUtils.renderIntoDocument(this.form(this.fixture));
    });

    it('will render the remove template', function(){
      var html = TestUtils.findRenderedDOMComponentWithClass(this.component, 'config-editor');
      expect(TestUtils.isDOMComponent(html)).toEqual(true);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'edit-component').length).toEqual(1);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'add-component').length).toEqual(1);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'remove-component').length).toEqual(1);
    });

    it('will publish remove components event when "remove" is clicked', function(done){
      this.handler = function(){};
      var btn = TestUtils.findRenderedDOMComponentWithClass(this.component, 'remove-component');
      spyOn(this, 'handler');
      Dispatcher.register( 'TOGGLE-TEST-REMOVE', function(action,data){
        if( action === constants.actions.COMPONENT_REMOVE) {
          this.handler(data);
          Dispatcher.unregister( 'TOGGLE-TEST-REMOVE');
        }
      }.bind(this));
      TestUtils.Simulate.click(btn);
      setTimeout(function(){
        expect(this.handler).toHaveBeenCalledWith(this.fixture);
        done();
      }.bind(this), 300);
    });

  });

});
