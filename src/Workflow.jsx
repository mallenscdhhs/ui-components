'use-strict';
var React = require('react');
var _ = require('lodash');
var Page = require('./Page');
var Tree = require('./Tree');
var Action = require('./Action');
var GridRow = require('./GridRow');
var GridColumn = require('./GridColumn');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var EditorToggle = require('./EditorToggle');
var Immutable = require('immutable');

/**
 * Sets flow item state(disabled) based on passed in pageId. All pages
 * below the passed in pageId will be disabled.
 * @param {object} list - a linked list representing flow data
 * @param {string} pageId - a starting point
 */
function setFlowState(list, pageId){
  var next = list[pageId].next;
  if ( next ) {
    list[next].config.disabled = true;
    list = setFlowState(list, next);
  }
  var child = list[pageId].child;
  if ( child ) {
    list[child].config.disabled = true;
    list = setFlowState(list, child);
  }
  return list;
}

/**
 * Determine which actions to show based on the current state of the workflow.
 * @param {array} actions
 * @param {object} state
 * @returns {array}
 */
function getCurrentActionButtons(actions, state){
  return _.filter(actions, function(action){
    var hidePrevious = (action.id === 'workflow-previous-btn' && !state.previousPage);
    var hideSaveAndExit = (action.id === 'workflow-exit-btn' && !state.nextPage );
    return ! (hidePrevious || hideSaveAndExit);
  });
}

/**
 * Locate the previous page in the list. Previous can be either a direct sibling,
 * or a parent, or a direct sibling's last child.
 * @param {object} list - this binary tree of page configs
 * @param {string} id - the id of the page who's previous you want to find
 * @returns {string} the id of the previous page
 */
function findPrevious(list, id){
  return _.findKey(list, function(item){
    return item.next === id || item.child === id;
  });
}

/**
* Locate the next page in the list. Next can be either a direct sibling,
* or a parent's direct sibling.
* @param {object} list - this binary tree of page configs
* @param {string} id - the id of the page who's next you want to find
* @returns {string} the id of the next page
*/
function findNext(list, id){
  var next = list[id].child || list[id].next;
  if ( next ) {
    return next;
  } else {
    var parent = _.findKey(list, function(item){
      return item.child === id;
    });
    return parent? list[parent].next : undefined;
  }
}

function updateChildren(items, kids){
  return _.map(kids,function(kid){
    var child = Immutable.Map(kid);
    var props = Immutable.Map(kid.props);
    props.set('disabled',items[kid.props.id].config.disabled);
    if(kid.props.children){
      props.set('children',updateChildren(items,kid.props.children));
    }
    return child.set('props',props.toObject());
  });
}

/**
 * Renders a workflow that contains a Tree navigation and a Page.
 * @module Workflow
 */
module.exports = React.createClass({

  displayName: 'Workflow',

  propTypes: {
    title: React.PropTypes.string,
    items: React.PropTypes.object.isRequired,
    lastSectionCompleted: React.PropTypes.string,
    editMode: React.PropTypes.bool
  },

  /**
   * Used for unit testing.
   */
  statics: {
    setFlowState: setFlowState,
    getCurrentActionButtons: getCurrentActionButtons,
    findPrevious: findPrevious,
    findNext: findNext,
    updateChildren: updateChildren
  },

  getDefaultProps: function(){
    return {
      componentType: 'workflow'
    };
  },

  /**
   * Determine the current state of the workflow by analyzing the passed in prop data.
   * @returns {object}
   */
  getInitialState: function(){
    var firstPage = this.props.firstPage;
    var flow = this.props.items;
    var current = (this.props.lastSectionCompleted)?  flow[this.props.lastSectionCompleted].next : firstPage;

    if ( !this.props.editMode ) {
      flow = setFlowState(flow, current);
    }

    return {
      currentPage: current,
      previousPage: findPrevious(flow, current),
      nextPage: current.next,
      flow: flow
    };
  },

  /**
   * Subscribe to workflow events.
   */
  componentDidMount: function(){
    Dispatcher.register( this.props.id + '-WORKFLOW' , function(action,data){
      if( action === constants.actions.TREE_LOAD_PAGE) {
        this.handleDirect(data.id);
      }else if( action === constants.actions.WORKFLOW_PREVIOUS_PAGE){
        this.handlePrevious();
      }else if( action === constants.actions.WORKFLOW_NEXT_PAGE){
        this.handleNext();
      }
    }.bind(this));
  },

  /**
  * Unsubscribe from all events.
  */
  componentWillUnmount: function(){
    Dispatcher.unregister( this.props.id + '-WORKFLOW' );
  },

  /**
   * Update workflow state to passed in page, and rerender.
   * Also push notification to the app.
   * @fires workflow:load:page
   * @param {string} pageId
   */
  handleDirect: function(pageId){
    this.setState({
      currentPage: pageId,
      nextPage: findNext(this.state.flow, pageId),
      previousPage: findPrevious(this.state.flow, pageId),
      flow: setFlowState(this.state.flow,pageId)
    });
    Flux.doAction( constants.actions.WORKFLOW_LOAD_PAGE , { 'page' : pageId }  );
  },

  /**
   * Get the next page, if available, and update workflow.
   * @fires workflow:load:page
   */
  handleNext: function(){
    var next = findNext(this.state.flow, this.state.currentPage);
    if( next ){
      this.handleDirect(next);
    }
  },

  /**
   * Get the previous page, if available, and update workflow.
   * @fires workflow:load:page
   */
  handlePrevious: function(){
    var previous = findPrevious(this.state.flow, this.state.currentPage);
    if( previous ){
      this.handleDirect(previous);
    }
  },

  /**
   * @returns {React}
   */
  render: function(){
    var actions = getCurrentActionButtons(this.props.actions, this.state);
    return (
      <GridRow>
        <GridColumn md="3">
          <div className="editable-component">
            <EditorToggle {...this.props}/>
            <h4>{this.props.title}</h4>
            <Tree ref="outline">
              { updateChildren(this.state.flow, this.props.children) }
            </Tree>
          </div>
        </GridColumn>
        <GridColumn md="9">
          <div id="workflow-page"></div>
          <div id="workflow-status"></div>
          <div id="workflow-actions" className="text-right">
            {_.map(actions, function(action, i){
              return <Action {...action} key={this.props.component_id+'-action-'+i}/>;
            }, this)}
          </div>
        </GridColumn>
      </GridRow>
    );
  }
});
