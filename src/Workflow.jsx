'use-strict';
var React = require('react');
var _ = require('lodash');
var Page = require('./Page');
var Tree = require('./Tree');
var Action = require('./Action');
var GridRow = require('./GridRow');
var GridColumn = require('./GridColumn');
var Dispatcher = require('fluxify').dispatcher;
var constants = require('./constants');
/**
 * Build nested data structure for rendering a Tree.
 * @param {object} state - a component state object
 * @returns {array}
 */
function buildTree(state){
  var tree = [];
  var head = state.flow[state.firstPage];
  var children = _.groupBy(_.filter(_.values(state.flow), function(item){
    return !!item.parentId;
  }), 'parentId');

  while(head){
    var branches = children[head.id];
    var next = state.flow[head.next];
    if ( !!branches ) {
      head.items = children[head.id];
    }
    head.active = ( head.id === state.currentPage );
    tree.push(head);
    head = ( next && branches )? state.flow[next.next] : next;
  }
  return tree;
}

/**
 * Return a the pageId of the item that whose "key" does not exist. Useful
 * for finding the first/last page in a linked list.
 * @param {array} items
 * @param {string} key
 * @returns {string}
 */
function getPageByKeyExistence(items, key){
  return _.reduce(items, function(result, current, i){
    return current[key]? result : current.id;
  }, '');
}

/**
 * Sets flow item state(disabled) based on passed in pageId. All pages
 * below the passed in pageId will be disabled.
 * @param {object} list - a linked list representing flow data
 * @param {string} pageId - a starting point
 */
function setFlowState(list, pageId){
  var next = list[pageId].next;
  if ( next ) {
    list[next].disabled = true;
    setFlowState(list, next);
  }
}

/**
 * Determine which actions to show based on the current state of the workflow.
 * @param {array} actions
 * @param {object} state
 * @returns {array}
 */
function getCurrentActionButtons(actions, state){
  return _.filter(actions, function(action){
    return ! (
         (action.id === 'workflow-previous-btn' && !state.previousPage )
      || (action.id === 'workflow-exit-btn' && !state.nextPage )
    );
  });
}


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
    buildTree: buildTree,
    getPageByKeyExistence: getPageByKeyExistence,
    setFlowState: setFlowState,
    getCurrentActionButtons: getCurrentActionButtons
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
    var pageObjs = _.values(this.props.items);
    var firstPage = getPageByKeyExistence(pageObjs, 'previous');
    var lastPage = getPageByKeyExistence(pageObjs, 'next');
    var current = (this.props.lastSectionCompleted)?  this.props.items[this.props.lastSectionCompleted].next : firstPage;
    var flow = this.props.items;

    if ( !this.props.editMode ) {
      setFlowState(flow, current);
    }

    return {
      lastPage: lastPage,
      firstPage: firstPage,
      currentPage: current,
      previousPage: current.previous,
      nextPage: current.next,
      flow: flow
    };
  },

  /**
   * Subscribe to workflow events.
   */
  componentDidMount: function(){
    Dispatcher.register( this.props.id + '-WORKFLOW' , function(payload){
      if( payload.actionType === constants.actions.TREE_LOAD_PAGE) {
        this.handleDirect(payload.data.id);
      }else if( payload.actionType === constants.actions.WORKFLOW_PREVIOUS_PAGE){
        this.handlePrevious();
      }else if( payload.actionType === constants.actions.WORKFLOW_NEXT_PAGE){
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
      nextPage: this.state.flow[pageId].next,
      previousPage: this.state.flow[pageId].previous
    });
    Dispatcher.dispatch( { 'actionType' : constants.actions.WORKFLOW_LOAD_PAGE , 'data' : {'page':pageId} } );
  },

  /**
   * Get the next page, if available, and update workflow.
   * @fires workflow:load:page
   */
  handleNext: function(){
    var pageId = this.state.flow[this.state.currentPage].next ? this.state.flow[this.state.currentPage].next :  this.state.currentPage;
    if(pageId !== this.state.currentPage){
      this.handleDirect(pageId);
    }
  },

  /**
   * Get the previous page, if available, and update workflow.
   * @fires workflow:load:page
   */
  handlePrevious: function(){
    var pageId = this.state.flow[this.state.currentPage].previous ? this.state.flow[this.state.currentPage].previous : this.state.currentPage;
    if(pageId !== this.state.currentPage){
      this.handleDirect(pageId);
    }
  },

  /**
   * @returns {React}
   */
  render: function(){
    var actions = getCurrentActionButtons(this.props.actions, this.state);
    var treeProps = {
      items: buildTree(this.state, this.props)
    };
    return (
      <GridRow>
        <GridColumn md="2">
          <h4>{this.props.title}</h4>
          <Tree {...treeProps} ref="outline" />
        </GridColumn>
        <GridColumn md="10">
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
