import React from 'react';
import _ from 'lodash';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react/lib/ReactTestUtils';
import Workflow from '../../src/Workflow';
import Flux from 'fluxify';
import constants from '../../src/constants';
import Immutable from 'immutable';

let Dispatcher = Flux.dispatcher;
let fixture = require('../fixtures/workflow-simple.json');
let childrenFixture = require('../fixtures/workflow-with-children.json');

describe('Workflow', function(){

  beforeEach(function(){
    this.config = _.clone(fixture);
    this.component = Factory.build(elements, this.config, this.config)[0];
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
    let dom = this.workflow.getDOMNode();
    expect(dom.className).toEqual('editable-component');
    expect(dom.childNodes[0].className).toEqual('config-editor');
    expect(dom.childNodes[0].childNodes[0].className).toEqual('config-editor-label');
    expect(dom.childNodes[0].childNodes[1].className).toEqual('edit-component');
  });

  describe('#configure', function(){
    let iSchema = Immutable.fromJS(fixture);
    let iComponents = Immutable.Map(fixture.components);
    it('can set "items"', function(){
      let config = Workflow.configure(iSchema, Immutable.Map(), iComponents);
      expect(config.items).toBeDefined();
      expect(config.items.length).toEqual(fixture.components.length);
    });
    it('can set "firstPage"', function(){
      let config = Workflow.configure(iSchema, Immutable.Map(), iComponents);
      expect(config.firstPage).toBeDefined();
      expect(config.firstPage).toEqual(fixture.child);
    });
  });

  describe('#setFlowState', function(){
    it('can set the tree data state', function(){
      let items = {
        'a': {id: 'a', next: 'b',  previous: null, config : {}},
        'b': {id: 'b', next: 'c',  previous: 'a',  config : {}},
        'c': {id: 'c', next: null, previous: 'b',  config : {}}
      };
      expect(items.a.config.disabled).not.toBeDefined();
      expect(items.b.config.disabled).not.toBeDefined();
      expect(items.c.config.disabled).not.toBeDefined();
      let newItems = Workflow.setFlowState(items, 'b', 'a');
      expect(newItems.a.config.disabled).toBe(false);
      expect(newItems.b.config.disabled).toBe(false);
      expect(newItems.c.config.disabled).toBe(true);
    });
  });

  describe('#getCurrentActionButtons', function(){
    beforeEach(function(){
      this.config = _.clone(fixture).config;
    });
    it('can return the correct buttons to show on the first page', function(){
      let state = {
        currentPage: 'page1',
        previousPage: null,
        nextPage: 'page2',
        firstPage: 'page1'
      };
      let actions = Workflow.getCurrentActionButtons(this.config.actions, state);
      expect(actions.length).toEqual(3);
      expect(actions[0].id).toEqual(this.config.actions[1].id);
    });
    it('can return the correct buttons to show for the last page', function(){
      let state = {
        currentPage: 'page3',
        previousPage: 'page2',
        nextPage: null,
        firstPage: 'page1'
      };
      let actions = Workflow.getCurrentActionButtons(this.config.actions, state);
      expect(actions.length).toEqual(3);
      expect(actions[0].id).toEqual(this.config.actions[0].id);
      expect(actions[2].id).toEqual(this.config.actions[2].id);
    });
  });

  describe('#findPrevious', function(){
    it('will locate any previous node from a current node', function(){
      expect(Workflow.findPrevious(fixture.components, 'page1')).toBeUndefined();
      expect(Workflow.findPrevious(fixture.components, 'page2')).toEqual('page1');
      expect(Workflow.findPrevious(fixture.components, 'page3')).toEqual('page2');
    });
  });

  describe('#findNext', function(){
    it('can locate any next node', function(){
      expect(Workflow.findNext(fixture.components, 'page1')).toEqual('page2');
      expect(Workflow.findNext(fixture.components, 'page2')).toEqual('page3');
      expect(Workflow.findNext(fixture.components, 'page3')).toBeUndefined();
    });
  });

  describe('#getItemDetails', function() {

    it('returns proper item details for first top level item',function() {
      let item = Workflow.getItemDetails(childrenFixture.components, 'page1');
      expect(item.id).toEqual('page1');
      expect(item.next).toEqual('page2');
      expect(item.parent).toBeUndefined();
      expect(item.previous).toBeUndefined();
    });

    it('returns proper item details for parent',function() {
      let item = Workflow.getItemDetails(childrenFixture.components, 'page2');
      expect(item.id).toEqual('page2');
      expect(item.next).toEqual('page5');
      expect(item.parent).toBeUndefined();
      expect(item.previous).toEqual('page1');
    });

    it('returns proper item details for first nested item',function() {
      let item = Workflow.getItemDetails(childrenFixture.components, 'page3');
      expect(item.id).toEqual('page3');
      expect(item.next).toEqual('page4');
      expect(item.parent).toEqual('page2');
      expect(item.previous).toBeUndefined();;
    });

    it('returns proper item details for middle nested item',function() {
      let fixture = require('../fixtures/workflow-with-children.json');
      let item = Workflow.getItemDetails(childrenFixture.components, 'page4');
      expect(item.id).toEqual('page4');
      expect(item.next).toEqual('page6');
      expect(item.parent).toBeUndefined();
      expect(item.previous).toEqual('page3');
    });

    it('returns proper item details for last nested item',function() {
      let item = Workflow.getItemDetails(childrenFixture.components, 'page7');
      expect(item.id).toEqual('page7');
      expect(item.next).toBeUndefined();
      expect(item.parent).toBeUndefined();
      expect(item.previous).toEqual('page6');
    });

    it('returns proper item details for last top level item',function() {
      let item = Workflow.getItemDetails(childrenFixture.components, 'page5');
      expect(item.id).toEqual('page5');
      expect(item.next).toBeUndefined();
      expect(item.parent).toBeUndefined();
      expect(item.previous).toEqual('page2');
    });

  });

  describe('#updateChildren', function() {
    it('updates react components properly', function () {
      let components = Factory.build(elements, childrenFixture, childrenFixture)[0];
      let flow = _.cloneDeep(childrenFixture.components);
      flow.page1.config.disabled = false;
      flow.page2.config.disabled = false;
      flow.page5.config.disabled = true;
      let newItems = Workflow.updateChildren(flow, components.props.children);
      expect(newItems[0].props.disabled).toEqual(false);
      expect(newItems[1].props.disabled).toEqual(false);
      expect(newItems[2].props.disabled).toEqual(true);
    });
  });

  describe('#getItemFirstParent', function() {
    it('returns parent, if any, of passed in pageId', function () {
      let firstParent = Workflow.getItemFirstParent(childrenFixture.components,'page6');
      expect(firstParent).toEqual('page2');
    });
  });

  describe('#getItemLastChild', function() {
    it('returns last child in a line of passed in pageId', function () {
      let lastChild = Workflow.getItemLastChild(childrenFixture.components,'page3');
      expect(lastChild).toEqual('page7');
    });
  });

});
