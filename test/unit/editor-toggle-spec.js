var React = require('react/addons');
var Components = require('../../src/main');
var TestUtils = React.addons.TestUtils;
var EQ = Components.eventQueue;

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
      EQ.subscribe('component:edit', 'test-edit-handler', this.handler);    
      TestUtils.Simulate.click(editComponent);
      setTimeout(function(){
        expect(this.handler).toHaveBeenCalledWith(this.fixture, 'component:edit');
        done();
      }.bind(this), 300);
      EQ.unSubscribe('component:edit', 'test-edit-handler');
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
      EQ.subscribe('component:add', 'test-add-handler', this.handler);    
      TestUtils.Simulate.click(btn);
      setTimeout(function(){
        expect(this.handler).toHaveBeenCalledWith(this.fixture, 'component:add');
        done();
      }.bind(this), 300);
      EQ.unSubscribe('component:add', 'test-add-handler');
    });

  });

});