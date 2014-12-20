describe('EditorMixin', function(){

  var TestUtils = React.addons.TestUtils;
  var EQ = Components.eventQueue;

  var mockEvent = {
    stopPropagation: function(){},
    preventDefault: function(){}
  };

  document.body.insertAdjacentHTML('afterBegin', '<div id="editor-mixin-test"></div>');

  describe('edit-component button', function(){
    beforeEach(function(){
      this.fixture = {type: 'text', name: 'test', label: 'test' ,componentType: 'field'};
      this.field = React.createFactory(Components.elements.field);
      this.dom = document.getElementById('editor-mixin-test');
      this.component = React.render(this.field(this.fixture), this.dom);
    });

    it('will render the edit template', function(){    
      var html = TestUtils.findRenderedDOMComponentWithClass(this.component, 'config-editor');
      expect(TestUtils.isDOMComponent(html)).toEqual(true);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'edit-component').length).toEqual(1);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'add-component').length).toEqual(0);
    });

    it('will publish a components props when "edit" is clicked', function(done){
      this.handler = function(){};
      spyOn(this, 'handler');
      EQ.subscribe('component:edit', 'test-edit-handler', this.handler);    
      TestUtils.Simulate.click(document.querySelector('.edit-component'));
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
      this.dom = document.getElementById('editor-mixin-test');
      this.component = React.render(this.page(this.fixture), this.dom);
    });
    it('will render the add template', function(){    
      var html = TestUtils.findRenderedDOMComponentWithClass(this.component, 'config-editor');
      expect(TestUtils.isDOMComponent(html)).toEqual(true);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'edit-component').length).toEqual(1);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'add-component').length).toEqual(1);
    });    
    it('will publish a components props when "add" is clicked', function(done){
      this.handler = function(){};
      spyOn(this, 'handler');
      EQ.subscribe('component:add', 'test-add-handler', this.handler);    
      TestUtils.Simulate.click(document.querySelector('.add-component'));
      setTimeout(function(){
        expect(this.handler).toHaveBeenCalledWith(this.fixture, 'component:add');
        done();
      }.bind(this), 300);
      EQ.unSubscribe('component:add', 'test-add-handler');
    });
  });
});