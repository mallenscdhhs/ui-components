var React = require('react');
require('es6-promise').polyfill();
var Components = require('../../src/main');
var _ = require('lodash');
var TestUtils = require('react/lib/ReactTestUtils');
var Workflow = require('../../src/Workflow');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('../../src/constants');
var fixture = require('../fixtures/workflow-simple.json');

describe('Workflow component', function(){

  beforeEach(function(){
    this.config = _.clone(fixture);
    this.component = Components.factory(this.config);
    this.workflow = TestUtils.renderIntoDocument(this.component);
  });

  it('can progress to the next section', function(done){
    expect(this.workflow.state.currentPage).toEqual('page1');
    Flux.doAction(constants.actions.WORKFLOW_NEXT_PAGE);
    setTimeout(function(){
      expect(this.workflow.state.currentPage).toEqual('page2');
      expect(this.workflow.state.previousPage).toEqual('page1');
      expect(this.workflow.state.nextPage).toEqual('page3');
      done();
    }.bind(this), 300);
  });

  it('can revert to the previous section', function(done){
    this.workflow.setState({currentPage: 'page2', previousPage: 'page1', nextPage: 'page3'});
    expect(this.workflow.state.currentPage).toEqual('page2');
    Flux.doAction( constants.actions.WORKFLOW_PREVIOUS_PAGE );
    setTimeout(function(){
      expect(this.workflow.state.currentPage).toEqual('page1');
      expect(this.workflow.state.previousPage).toBeUndefined();
      expect(this.workflow.state.nextPage).toEqual('page2');
      done();
    }.bind(this), 300);
  });

  it('can navigate to a specified section', function(){
    expect(this.workflow.state.currentPage).toEqual('page1');
    this.workflow.handleDirect('page2');
    expect(this.workflow.state.currentPage).toEqual('page2');
    expect(this.workflow.state.previousPage).toEqual('page1');
    expect(this.workflow.state.nextPage).toEqual('page3');
  });

  it('can render a workflow', function(){
    var dom = this.workflow.getDOMNode();
    expect(dom.className).toEqual('row');
    expect(dom.childNodes[0].className).toEqual('col-md-3');
    expect(dom.childNodes[0].childNodes[0].className).toEqual('editable-component');
    expect(dom.childNodes[1].childNodes[0].id).toEqual('workflow-page');
  });
});

describe('Workflow#setFlowState', function(){
  it('can set the tree data state', function(){
    var items = {
      'a': {id: 'a', next: 'b',  previous: null, config : {}},
      'b': {id: 'b', next: 'c',  previous: 'a',  config : {}},
      'c': {id: 'c', next: null, previous: 'b',  config : {}}
    };
    expect(items.a.config.disabled).not.toBeDefined();
    expect(items.b.config.disabled).not.toBeDefined();
    expect(items.c.config.disabled).not.toBeDefined();
    Workflow.setFlowState(items, 'b', 'a');
    expect(items.a.config.disabled).toBe(false);
    expect(items.b.config.disabled).toBe(false);
    expect(items.c.config.disabled).toBe(true);
  });
});

describe('Workflow#getCurrentActionButtons', function(){
  beforeEach(function(){
    this.config = _.clone(fixture).config;
  });
  it('can return the correct buttons to show on the first page', function(){
    var state = {
      currentPage: 'page1',
      previousPage: null,
      nextPage: 'page2',
      firstPage: 'page1'
    };
    var actions = Workflow.getCurrentActionButtons(this.config.actions, state);
    expect(actions.length).toEqual(3);
    expect(actions[0].id).toEqual(this.config.actions[1].id);
  });
  it('can return the correct buttons to show for the last page', function(){
    var state = {
      currentPage: 'page3',
      previousPage: 'page2',
      nextPage: null,
      firstPage: 'page1'
    };
    var actions = Workflow.getCurrentActionButtons(this.config.actions, state);
    expect(actions.length).toEqual(3);
    expect(actions[0].id).toEqual(this.config.actions[0].id);
    expect(actions[2].id).toEqual(this.config.actions[2].id);
  });
});

describe('Workflow#findPrevious', function(){
  it('will locate any previous node from a current node', function(){
    expect(Workflow.findPrevious(fixture.components, 'page1')).toBeUndefined();
    expect(Workflow.findPrevious(fixture.components, 'page2')).toEqual('page1');
    expect(Workflow.findPrevious(fixture.components, 'page3')).toEqual('page2');
  });
});

describe('Workflow#findNext', function(){
  it('can locate any next node', function(){
    expect(Workflow.findNext(fixture.components, 'page1')).toEqual('page2');
    expect(Workflow.findNext(fixture.components, 'page2')).toEqual('page3');
    expect(Workflow.findNext(fixture.components, 'page3')).toBeUndefined();
  });
});

describe('#getItemDetails', function() {

  it('returns proper item details for first top level item',function() {
    var fixture = require('../fixtures/workflow-with-children.json');
    var item = Workflow.getItemDetails(fixture.components, 'page1');
    expect(item.id).toEqual('page1');
    expect(item.next).toEqual('page2');
    expect(item.parent).toBeUndefined();
    expect(item.previous).toBeUndefined();
  });

  it('returns proper item details for parent',function() {
    var fixture = require('../fixtures/workflow-with-children.json');
    var item = Workflow.getItemDetails(fixture.components, 'page2');
    expect(item.id).toEqual('page2');
    expect(item.next).toEqual('page5');
    expect(item.parent).toBeUndefined();
    expect(item.previous).toEqual('page1');
  });

  it('returns proper item details for first nested item',function() {
    var fixture = require('../fixtures/workflow-with-children.json');
    var item = Workflow.getItemDetails(fixture.components, 'page3');
    expect(item.id).toEqual('page3');
    expect(item.next).toEqual('page4');
    expect(item.parent).toEqual('page2');
    expect(item.previous).toBeUndefined();;
  });

  it('returns proper item details for middle nested item',function() {
    var fixture = require('../fixtures/workflow-with-children.json');
    var item = Workflow.getItemDetails(fixture.components, 'page4');
    expect(item.id).toEqual('page4');
    expect(item.next).toEqual('page6');
    expect(item.parent).toBeUndefined();
    expect(item.previous).toEqual('page3');
  });

  it('returns proper item details for last nested item',function() {
    var fixture = require('../fixtures/workflow-with-children.json');
    var item = Workflow.getItemDetails(fixture.components, 'page7');
    expect(item.id).toEqual('page7');
    expect(item.next).toBeUndefined();
    expect(item.parent).toBeUndefined();
    expect(item.previous).toEqual('page6');
  });

  it('returns proper item details for last top level item',function() {
    var fixture = require('../fixtures/workflow-with-children.json');
    var item = Workflow.getItemDetails(fixture.components, 'page5');
    expect(item.id).toEqual('page5');
    expect(item.next).toBeUndefined();
    expect(item.parent).toBeUndefined();
    expect(item.previous).toEqual('page2');
  });

});

describe('#updateChildren', function() {
  it('updates react components properly', function () {
    var fixture = require('../fixtures/workflow-with-children.json');
    var components = Components.factory(fixture);
    var flow = _.cloneDeep(fixture.components);
    flow.page1.config.disabled = false;
    flow.page2.config.disabled = false;
    flow.page5.config.disabled = true;
    var newItems = Workflow.updateChildren(flow,components.props.children);
    expect(newItems[0].props.disabled).toEqual(false);
    expect(newItems[1].props.disabled).toEqual(false);
    expect(newItems[2].props.disabled).toEqual(true);
  });
});