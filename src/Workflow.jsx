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


/**
 * Return details for passed in itemId
 * @param {object} schema
 * @param {object} itemId
 * @return {{id: *, previous: *, parent: *, next: *}}
 */
function getItemDetails(schema, itemId){
  return {
    'id': itemId,
    'previous': _.findKey(schema, {'next': itemId}),
    'parent': _.findKey(schema, {'child': itemId}),
    'next': schema[itemId].next,
    'child': schema[itemId].child
  };
}

/**
 * Sets flow item state(disabled) based on passed in pageId. All pages
 * below the passed in pageId will be disabled, while all those above (including the page itself) will
 * not be disabled.
 * @param {object} list - a linked list representing flow data
 * @param {string} pageId - a starting point
 * @param {string} startId - first item in list, not the current page, but the very first page
 */
function setFlowState(list, pageId, startId) {
  return updateFlowState(refreshFlowState(list,startId),pageId);
}

/**
 * Set all items below pageId to disabled
 * @param list
 * @param pageId
 * @return {*}
 */
function updateFlowState(list,pageId){
  var item = getItemDetails(list, pageId);
  var parentItem;
  if ( item.next ) {
    list[item.next].config.disabled = true;
    list = updateFlowState(list, item.next);
  }
  if ( item.child ) {
    list[item.child].config.disabled = true;
    list = updateFlowState(list, item.child);
  }
  if ( item.parent ) {
    parentItem = getItemDetails(list, item.parent);
    if(parentItem.next) {
      list[parentItem.next].config.disabled = true;
      list = updateFlowState(list, parentItem.next);
    }
  }
  return list;
}

/**
 * Set all pages in list, with pageId as the FIRST page, to enabled.
 * @param list
 * @param pageId
 * @return {*}
 */
function refreshFlowState(list,pageId){
  var item = getItemDetails(list, pageId);
  list[pageId].config.disabled = false;
  if ( item.next ) {
    list = refreshFlowState(list, item.next);
  }
  if ( item.child ) {
    list = refreshFlowState(list, item.child);
  }
  return list;
}

/**
 * Follow tree up from item, to find first parent encountered
 * @param schema
 * @param itemId
 * @return {object} updated schema
 */
function getItemFirstParent(schema, itemId){
  var item = getItemDetails(schema,itemId);
  while(item && !item.parent){
    item = getItemDetails(schema,item.previous);
  }
  return item.parent;
}

/**
 * Follow tree down from item, to find last element in the tree
 * @param schema
 * @param itemId
 * @return {object}  Updated Schema
 */
function getItemLastChild(schema, itemId){
  var item = getItemDetails(schema,itemId);
  while(item && item.next){
    item = getItemDetails(schema,item.next);
  }
  return item.id;
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
  var item = getItemDetails(list,id);
  var previousId;
  var previousItem;
  var parentItem;
  if(item.previous){
    previousItem = getItemDetails(list,item.previous);
    if(previousItem.child){
      previousId= getItemLastChild(list,previousItem.child);
    }else{
      previousId = previousItem.id;
    }
  }else if(item.parent){
    parentItem = getItemDetails(list,item.parent);
    previousId = parentItem.id;
  }
  return previousId;
}

/**
* Locate the next page in the list. Next can be either a direct sibling,
* or a parent's direct sibling.
* @param {object} list - this binary tree of page configs
* @param {string} id - the id of the page who's next you want to find
* @returns {string} the id of the next page
*/
function findNext(list, id){
  var item = getItemDetails(list,id);
  var nextId;
  var parentItem;
  if(item.child) {
    nextId = item.child;
  }else if ( item.next ) {
    nextId = item.next;
  }else if( item.parent){
    parentItem = getItemDetails(list,item.parent);
    nextId = parentItem.next;
  }
  return nextId;
}

/**
 * Iterate over ReactComponents, and set their 'disabled' status based on the value from the
 * 'items' object which is the state object containing current item status.
 * @param flowItems
 * @param components
 * @return {*}
 */
function updateChildren(flowItems, components){
  return _.map(components,function(component){
    component.props.disabled = flowItems[component.props.id].config.disabled;
    if(component.props.children){
      component.props.children = updateChildren(flowItems, component.props.children);
    }
    return component;
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
    updateChildren: updateChildren,
    getItemDetails : getItemDetails
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
    var current = ( this.props.lastSectionCompleted ) ?
      findNext( flow, this.props.lastSectionCompleted ) :
      firstPage;

    if ( !this.props.editMode ) {
      flow = setFlowState(flow, current, firstPage);
    }

    return {
      currentPage: current,
      nextPage: findNext(flow, current),
      previousPage: findPrevious(flow, current),
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
      flow: setFlowState(this.state.flow, pageId, this.props.firstPage)
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
