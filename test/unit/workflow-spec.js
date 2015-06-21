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
    let workflow = this.workflow;
    expect(workflow.state.currentPage).toEqual('page2');
    Flux.doAction(constants.actions.WORKFLOW_NEXT_PAGE).then(function(){
      expect(workflow.state.currentPage).toEqual('page3');
      expect(workflow.state.previousPage).toEqual('page2');
      expect(workflow.state.nextPage).not.toBeDefined();
      done();
    });
  });

  it('can skip the next section', function(done){
    let config = childrenFixture;
    let component = Factory.build(elements, config, config)[0];
    let workflow = TestUtils.renderIntoDocument(component);
    let dom = React.findDOMNode(workflow);
    let ul = dom.childNodes[2];
    let page1Link = ul.childNodes[0].childNodes[1];
    let page2Link = ul.childNodes[1].childNodes[1];

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
    expect(dom.className).toEqual('editable-component');
    expect(dom.childNodes[0].className).toEqual('config-editor');
    expect(dom.childNodes[0].childNodes[0].className).toEqual('config-editor-label');
    expect(dom.childNodes[0].childNodes[1].className).toEqual('edit-component');
    expect(items.length).toBe(2);
    expect(items[0].className).toEqual('editable-component');
    expect(/disabled/.test(items[1].className)).toBe(true);
    expect(/current/.test(items[0].childNodes[2].childNodes[0].className)).toBe(true);
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
});
