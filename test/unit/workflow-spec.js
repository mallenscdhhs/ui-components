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
    expect(dom.className).toEqual('editable-component');
    expect(dom.childNodes[0].className).toEqual('row');
    expect(dom.childNodes[0].childNodes[1].className).toEqual('col-md-10');
    expect(dom.childNodes[0].childNodes[1].childNodes[0].tagName.toLowerCase()).toEqual('div');
    expect(dom.childNodes[0].childNodes[1].childNodes[0].id).toEqual('workflow-page');
  });
});

describe('Workflow#setFlowState', function(){
  it('can set the tree data state', function(){
    var items = {
      'a': {id: 'a', next: 'b', previous: null},
      'b': {id: 'b', next: 'c', previous: 'a', parentId: 'a'},
      'c': {id: 'c', next: null, previous: 'b'}
    };
    expect(items.a.disabled).not.toBeDefined();
    expect(items.b.disabled).not.toBeDefined();
    expect(items.c.disabled).not.toBeDefined();
    Workflow.setFlowState(items, 'b');
    expect(items.a.disabled).not.toBeDefined();
    expect(items.b.disabled).not.toBeDefined();
    expect(items.c.disabled).toBe(true);
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
    expect(Workflow.findPrevious(fixture.components, 'page3')).toEqual('page1');
  });
});

describe('Workflow#findNext', function(){
  it('can locate any next node', function(){
    expect(Workflow.findNext(fixture.components, 'page1')).toEqual('page2');
    expect(Workflow.findNext(fixture.components, 'page2')).toEqual('page3');
    expect(Workflow.findNext(fixture.components, 'page3')).toBeUndefined();
  });
});
