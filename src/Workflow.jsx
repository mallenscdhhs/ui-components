'use-strict';
import React from 'react';
import _ from 'lodash';
import Tree from './Tree';
import Action from './Action';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from './constants';
import EditorToggle from './EditorToggle';
import Immutable from 'immutable';
import SchemaUtils from '@scdhhs/ui-component-schema-utils';
import Factory from './Factory';
import WorkflowItem from './WorkflowItem';

/**
 * Manages the flow of a user through a set of defined screens.
 * @class Workflow
 */
class Workflow extends React.Component {
  /**
   * returns the index in the flattened workflow of the current page id
   * @param {string} currentId
   * @param {string[]} workflow
   * @returns {number}
   */
  static getCurrentIndex(currentId, workflow){
    return _.findIndex(workflow, id => id === currentId);
  }

  /**
   * Search through the workflow list to find the next index.
   * @static
   * @param {string} currentId - the current item id
   * @param {string[]} workflow - an array of id's
   * @returns {string}
   */
  static getNext(currentId, workflow){
    return workflow[Workflow.getCurrentIndex(currentId, workflow) + 1];
  }

  /**
   * Search through the workflow list to find the previous index.
   * @static
   * @param {string} currentId - the current item id
   * @param {string[]} workflow - an array of id's
   * @returns {string}
   */
  static getPrevious(currentId, workflow){
    return workflow[Workflow.getCurrentIndex(currentId, workflow) - 1];
  }

  /**
   * Get a list of disabled workflowitem id's.
   * @param {string[]} workflow - a list of workflowitem id's
   * @param {string} currentId - the page to disable from
   * @returns {string[]}
   */
  static getDisabledItems(workflow, currentId){
    return workflow.slice(Workflow.getCurrentIndex(currentId, workflow) + 1);
  }

  /**
   * Provides configuration processing for Workflow.
   * @param {Immutable.Map} schema - this components schema
   * @param {Immutable.Map} [model] - the data model(if any)
   * @param {Immutable.Map} components - the component list
   * @returns {JSON}
   */
  static configure(schema, model, components){
    let flatWorkflow = [];
    let rootSchema = { components: components.toJSON() };
    SchemaUtils.traverse(rootSchema, schema.get('child'), id => flatWorkflow.push(id));
    let currentPage = schema.get('child');
    let lastSectionCompleted = schema.getIn(['config','lastSectionCompleted']);
    if ( lastSectionCompleted ) {
      currentPage = Workflow.getNext(lastSectionCompleted, flatWorkflow);
    }
    return schema.getIn(['config']).withMutations(function(mutableConfig) {
      mutableConfig
        .setIn(['workflow'], flatWorkflow)
        .setIn(['currentPage'],currentPage);
    }).toJSON();
  }

  /**
   * rebuild the children components using updated props from the worfklow state
   * @param {object} children - the element's children
   * @param {string[]} disabledItems
   * @param {string} currentPage
   * @returns {object}
   */
  static renderChildren(children, disabledItems, currentPage){
    return React.Children.map(children, child => {
      let isCurrent = child.props.id === currentPage;
      let isDisabled = _.contains(disabledItems, child.props.id);
      let children = [];
      let props = Immutable.Map(child.props)
        .set('disabled', isDisabled)
        .set('current', isCurrent);
      if ( child.props.children ) {
        children = Workflow.renderChildren(child.props.children, disabledItems, currentPage);
      }
      return React.cloneElement(child, props.toJSON(), children);
    });
  }

  /**
   * render a title if supplied in props
   * @param {object} props
   * @returns {?JSX}
   */
  static renderTitle(props){
    if ( props.title ) {
      return <h4>{props.title}</h4>;
    }
  }

  constructor(){
    super();
    this.state = {
      currentPage: '',
      nextPage: '',
      previousPage: ''
    };
  }

  componentWillMount(){
    this.setState({
      currentPage: this.props.currentPage,
      nextPage: Workflow.getNext(this.props.currentPage, this.props.workflow),
      previousPage: Workflow.getPrevious(this.props.currentPage, this.props.workflow)
    });
    Flux.doAction(constants.actions.WORKFLOW_LOAD_PAGE, { page: this.props.currentPage });
  }

  /**
   * Subscribe to workflow events.
   */
  componentDidMount(){
    Dispatcher.register('workflow-actions', function(action, data){
      if ( action === constants.actions.TREE_LOAD_PAGE) {
        this.handleDirect(data.id);
      } else if ( action === constants.actions.WORKFLOW_PREVIOUS_PAGE ) {
        this.handlePrevious();
      } else if ( action === constants.actions.WORKFLOW_NEXT_PAGE) {
        this.handleNext();
      }
    }.bind(this));
  }

  /**
  * Unsubscribe from all events.
  */
  componentWillUnmount(){
    Dispatcher.unregister('workflow-actions');
  }

  /**
   * Update workflow state to passed in page, and rerender.
   * Also push notification to the app.
   * @fires workflow:load:page
   * @param {string} pageId
   */
  handleDirect(pageId){
    this.setState({
      currentPage: pageId,
      nextPage: Workflow.getNext(pageId, this.props.workflow),
      previousPage: Workflow.getPrevious(pageId, this.props.workflow)
    });
    Flux.doAction(constants.actions.WORKFLOW_LOAD_PAGE, { page: pageId });
  }

  /**
   * Get the next page, if available, and update workflow.
   * @fires workflow:load:page
   */
  handleNext(){
    var next = Workflow.getNext(this.state.currentPage, this.props.workflow);
    if( next ){
      this.handleDirect(next);
    }
  }

  /**
   * Get the previous page, if available, and update workflow.
   * @fires workflow:load:page
   */
  handlePrevious(){
    var previous = Workflow.getPrevious(this.state.currentPage, this.props.workflow);
    if( previous ){
      this.handleDirect(previous);
    }
  }

  /**
   * Only re-render the tree if the current page has changed.
   * @param {object} nextState
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState){
    return nextState.currentPage !== this.state.currentPage;
  }

  /**
   * @returns {JSX}
   */
  render(){
    let currentPage = this.state.currentPage;
    let disabledItems = Workflow.getDisabledItems(this.props.workflow, currentPage);
    return (
      <div className="editable-component">
        <EditorToggle {...this.props}/>
        {Workflow.renderTitle(this.props)}
        <Tree ref="outline">
          {Workflow.renderChildren(this.props.children, disabledItems, currentPage)}
        </Tree>
      </div>
    );
  }
}

Workflow.propTypes = {
  title: React.PropTypes.string,
  workflow: React.PropTypes.arrayOf(React.PropTypes.string),
  currentPage: React.PropTypes.string,
  lastSectionCompleted: React.PropTypes.string,
  editMode: React.PropTypes.bool
};

Workflow.defaultProps = {
  componentType: 'workflow'
};

export default Workflow;
