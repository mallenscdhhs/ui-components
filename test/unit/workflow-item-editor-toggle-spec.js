var React = require('react');
require('es6-promise').polyfill();
var Components = require('../../src/main');
var TestUtils = require('react/lib/ReactTestUtils');
var Dispatcher = require('fluxify').dispatcher;
var constants = require('../../src/constants');

describe('WorkflowEditorToggle', function(){

  beforeEach(function(){
    this.fixture = {id:'page1', title: 'Page 1', active: true , disabled: false, current: false };
    this.item = React.createFactory(Components.elements.workflowitem);
    this.component = TestUtils.renderIntoDocument(this.item(this.fixture));
  });

  it('will render edit, up, down, and status toggle', function(){
    var html = TestUtils.findRenderedDOMComponentWithClass(this.component, 'config-editor');
    expect(TestUtils.isDOMComponent(html)).toEqual(true);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'workflow-move-up-page').length).toEqual(1);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'workflow-move-down-page').length).toEqual(1);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'workflow-disable-page').length).toEqual(1);
  });

  it('will create event when TOGGLE STATUS is clicked', function(done){
    this.handler = function(){};
    spyOn(this, 'handler');

    Dispatcher.register( 'workflow-items-test-2', function(action,data){
      if( action === constants.actions.TOGGLE_DISABLE_WORKFLOW_PAGE) {
        this.handler(data);
        Dispatcher.unregister( 'workflow-items-test-2');
      }
    }.bind(this));

    var toggleComponent = TestUtils.findRenderedDOMComponentWithClass(this.component, 'workflow-disable-page');
    TestUtils.Simulate.click(toggleComponent);

    setTimeout(function(){
      expect(this.handler).toHaveBeenCalledWith(this.fixture);
      done();
    }.bind(this), 200);
  });

  it('will create event when MOVE UP is clicked', function(done){
    this.handler = function(){};
    spyOn(this, 'handler');

    Dispatcher.register( 'workflow-items-test-3', function(action,data){
      if( action === constants.actions.MOVE_WORKFLOW_PAGE) {
        this.handler(data);
        Dispatcher.unregister( 'workflow-items-test-3');
      }
    }.bind(this));

    var moveUpComponent = TestUtils.findRenderedDOMComponentWithClass(this.component, 'workflow-move-up-page');
    TestUtils.Simulate.click(moveUpComponent);

    setTimeout(function(){
      expect(this.handler).toHaveBeenCalledWith(this.fixture);
      done();
    }.bind(this), 200);
  });

  it('will create event when MOVE DOWN is clicked', function(done){
    this.handler = function(){};
    spyOn(this, 'handler');

    Dispatcher.register( 'workflow-items-test-4', function(action,data){
      if( action === constants.actions.MOVE_WORKFLOW_PAGE) {
        this.handler(data);
        Dispatcher.unregister( 'workflow-items-test-4');
      }
    }.bind(this));

    var moveDownComponent = TestUtils.findRenderedDOMComponentWithClass(this.component, 'workflow-move-down-page');
    TestUtils.Simulate.click(moveDownComponent);

    setTimeout(function(){
      expect(this.handler).toHaveBeenCalledWith(this.fixture);
      done();
    }.bind(this), 200);
  });

});
