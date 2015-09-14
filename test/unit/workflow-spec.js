import React from 'react';
import _ from 'lodash';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react/lib/ReactTestUtils';
import Workflow from '../../src/Workflow';
import WorkflowItem from '../../src/WorkflowItem';
import Flux from 'fluxify';
import constants from '../../src/constants';
import Immutable from 'immutable';

let Dispatcher = Flux.dispatcher;
let fixture = require('../fixtures/workflow-simple.json');
let longerWorkflow = require('../fixtures/workflow-simple-more-pages.json');
let childrenFixture = require('../fixtures/workflow-with-children.json');

describe('Workflow', function(){

  beforeEach(function(){
    this.config = _.clone(fixture);
    this.component = Factory.build(elements, this.config, this.config)[0];
    this.workflow = TestUtils.renderIntoDocument(this.component);
  });

  it('can progress to the next section', function(done){
    let workflow = this.workflow;
    expect(workflow.state.currentPage).toEqual('page2');
    Flux.doAction(constants.actions.WORKFLOW_NEXT_PAGE).then(function(){
      expect(workflow.state.currentPage).toEqual('page3');
      expect(workflow.state.previousPage).toEqual('page2');
      expect(workflow.state.nextPage).not.toBeDefined();
      done();
    });
  });

  it('can progress to the next section and update lastSectionCompleted', function(done){
    let config = longerWorkflow;
    let component = Factory.build(elements, config, config)[0];
    let workflow = TestUtils.renderIntoDocument(component);
    Flux.doAction(constants.actions.WORKFLOW_NEXT_PAGE).then(function(){
      expect(workflow.state.lastSectionCompleted).toEqual('page3');
      Flux.doAction(constants.actions.WORKFLOW_NEXT_PAGE).then(function(){
        expect(workflow.state.lastSectionCompleted).toEqual('page4');
        done();
      });
    });
  });

  it('can skip the next section', function(done){
    let config = childrenFixture;
    let component = Factory.build(elements, config, config)[0];
    let workflow = TestUtils.renderIntoDocument(component);
    let dom = React.findDOMNode(workflow);
    let ul = dom.childNodes[1];
    let page2Link = ul.childNodes[1].childNodes[0];

    expect(workflow.state.currentPage).toEqual('page1');
    Flux.doAction(constants.actions.WORKFLOW_NEXT_PAGE).then(function() {
      // page2 is skipped because page2 props.skip is true
      expect(workflow.state.currentPage).toEqual('page3');
      // navigate away to page5 to test again
      workflow.setState({currentPage: 'page5'});
      expect(workflow.state.currentPage).toEqual('page5');
      // click on page2 link in nav-tree
      TestUtils.Simulate.click(page2Link);
      setTimeout(function() {
        // page2 is skipped again
        expect(workflow.state.currentPage).toEqual('page3');
        done();
      }, 300);
    });
  });

  it('can revert to the previous section', function(done){
    this.workflow.setState({currentPage: 'page2', previousPage: 'page1', nextPage: 'page3'});
    expect(this.workflow.state.currentPage).toEqual('page2');
    Flux.doAction( constants.actions.WORKFLOW_PREVIOUS_PAGE ).then(function(){
      expect(this.workflow.state.currentPage).toEqual('page1');
      expect(this.workflow.state.previousPage).toBeUndefined();
      expect(this.workflow.state.nextPage).toEqual('page2');
      done();
    }.bind(this));
  });

  it('can navigate to a specified section', function(){
    expect(this.workflow.state.currentPage).toEqual('page2');
    this.workflow.handleDirect('page3');
    expect(this.workflow.state.currentPage).toEqual('page3');
    expect(this.workflow.state.previousPage).toEqual('page2');
    expect(this.workflow.state.nextPage).not.toBeDefined();
  });

  it('can render a workflow', function(){
    let dom = React.findDOMNode(this.workflow);
    let items = this.workflow.refs.outline.getDOMNode().childNodes;
    expect(items.length).toBe(2);
    expect(/disabled/.test(items[1].className)).toBe(true);
    expect(/current/.test(items[0].childNodes[1].childNodes[0].className)).toBe(true);
  });

  let iSchema = Immutable.fromJS(fixture);
  let iComponents = Immutable.Map(fixture.components);
  let config = Workflow.configure(iSchema, Immutable.Map(), iComponents);

  describe('#configure', function(){
    it('can set "workflow"', function(){
      expect(config.workflow).toBeDefined();
      expect(config.workflow.length).toEqual(Object.keys(fixture.components).length);
      expect(config.workflow[0]).toEqual('page1');
      expect(config.workflow[1]).toEqual('page2');
      expect(config.workflow[2]).toEqual('page3');
    });
    it('can set "currentPage"', function(){
      expect(config.currentPage).toBeDefined();
      expect(config.currentPage).toEqual('page2');
    });
  });

  describe('#getCurrentIndex', function(){
    it('will return the index in the workflow of the passed in ID', function(){
      let result = Workflow.getCurrentIndex('page2', config.workflow);
      expect(result).toEqual(1);
    });
  });

  describe('#getPrevious', function(){
    it('will locate any previous node from a current node', function(){
      expect(Workflow.getPrevious('page1', config.workflow)).toBeUndefined();
      expect(Workflow.getPrevious('page2', config.workflow)).toEqual('page1');
      expect(Workflow.getPrevious('page3', config.workflow)).toEqual('page2');
    });
  });

  describe('#getNext', function(){
    it('can locate any next node', function(){
      expect(Workflow.getNext('page1', config.workflow)).toEqual('page2');
      expect(Workflow.getNext('page2', config.workflow)).toEqual('page3');
      expect(Workflow.getNext('page3', config.workflow)).toBeUndefined();
    });
  });

  describe('#getDisabledItems', function(){
    it('will return a list of disabled ids', function(){
      let fromPage1 = Workflow.getDisabledItems(config.workflow, 'page1');
      let fromPage2 = Workflow.getDisabledItems(config.workflow, 'page2');
      let fromPage3 = Workflow.getDisabledItems(config.workflow, 'page3');
      expect(fromPage1.length).toBe(2);
      expect(fromPage1[0]).toBe('page2');
      expect(fromPage1[1]).toBe('page3');
      expect(fromPage2.length).toBe(1);
      expect(fromPage2[0]).toBe('page3');
      expect(fromPage3.length).toBe(0);
    });
  });

  describe('WorkflowItem#configure', function(){
    it('will properly set `nestable` and `unNestable` props for each page', function(){
      let components = Immutable.fromJS(childrenFixture.components);
      let schema = Immutable.fromJS(childrenFixture.components);
      let pageOne = WorkflowItem.configure(schema.get('page1'),{},components);
      let pageTwo = WorkflowItem.configure(schema.get('page2'),{},components);
      let pageThree = WorkflowItem.configure(schema.get('page3'),{},components);
      let pageFour = WorkflowItem.configure(schema.get('page4'),{},components);
      let pageSix = WorkflowItem.configure(schema.get('page6'),{},components);
      let pageSeven = WorkflowItem.configure(schema.get('page7'),{},components);
      let pageFive = WorkflowItem.configure(schema.get('page5'),{},components);
      expect(pageOne.nestable).toBe(false);
      expect(pageOne.unNestable).toBe(false);
      expect(pageTwo.nestable).toBe(true);
      expect(pageTwo.unNestable).toBe(false);
      expect(pageThree.nestable).toBe(false);
      expect(pageThree.unNestable).toBe(true);
      expect(pageFour.nestable).toBe(true);
      expect(pageFour.unNestable).toBe(true);
      expect(pageSix.nestable).toBe(true);
      expect(pageSix.unNestable).toBe(true);
      expect(pageSeven.nestable).toBe(true);
      expect(pageSeven.unNestable).toBe(true);
      expect(pageFive.nestable).toBe(true);
      expect(pageFive.unNestable).toBe(false);
    });
  });
});
