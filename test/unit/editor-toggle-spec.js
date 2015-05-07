import React from 'react';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react/lib/ReactTestUtils';
import { dispatcher as Dispatcher} from 'fluxify';
import constants from '../../src/constants';

var mockEvent = {
  stopPropagation: function(){},
  preventDefault: function(){}
};

var fixture = require('../fixtures/page-with-layout.json');

describe('EditorToggle', function(){

  it('will not allow a user to add a component to a Page', function(){
    var page = Factory.build(elements, fixture, fixture)[0];
    var component = TestUtils.renderIntoDocument(page);
    var btns = TestUtils.scryRenderedDOMComponentsWithClass(component, 'add-component');
    expect(btns.length).toEqual(0);
  });

  describe('edit-component button', function(){

    beforeEach(function(){
      this.fixture = {
        type: 'text',
        id:'test',
        name: 'test',
        label: 'test',
        componentType: 'field',
        initialState: 'visible',
        disabled : false,
        mask : '',
        forceManualInput : false
      };
      this.field = React.createFactory(elements.field);
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
    var fixture = require('../fixtures/fieldset.json');

    beforeEach(function(){
      var page = Factory.build(elements, fixture, fixture)[0];
      this.component = TestUtils.renderIntoDocument(page);
    });

    it('will render the add template', function(){
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'config-editor').length).toEqual(2);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'edit-component').length).toEqual(2);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'add-component').length).toEqual(1);
    });

    it('will publish a components props when "add" is clicked', function(done){
      var btn = TestUtils.findRenderedDOMComponentWithClass(this.component, 'add-component');

      Dispatcher.register( 'TOGGLE-TEST-2', function(action, data){
        var conf = fixture.config;
        if( action === constants.actions.COMPONENT_ADD ) {
          Dispatcher.unregister( 'TOGGLE-TEST-2');
          expect(data.name).toEqual(conf.name);
          done();
        }
      });

      TestUtils.Simulate.click(btn);
    });

  });

  describe('remove component button', function(){

    beforeEach(function(){
      this.fixture = {
        type: 'field',
        id:'test-field',
        componentType: 'field',
        name : 'testField',
        initialState: 'visible',
        disabled : false,
        mask : '',
        forceManualInput : false
      };
      this.field = React.createFactory(elements.field);
      this.component = TestUtils.renderIntoDocument(this.field(this.fixture));
    });

    it('will render the remove template', function(){
      var html = TestUtils.findRenderedDOMComponentWithClass(this.component, 'config-editor');
      expect(TestUtils.isDOMComponent(html)).toEqual(true);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'edit-component').length).toEqual(1);
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
