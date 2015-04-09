var Flux = require('fluxify');
var constants = require('./constants');
var React = require('react');
var _ = require('lodash');
var allowedToAdd = ['fieldset', 'form'];
var allowedToRemove = ['form', 'fieldset', 'field'];

/**
 * Display component editor controls
 * @module EditorToggle
 */
module.exports = React.createClass({

  /**
   * Stop event prop and push event to Queue, enabling global app to open the config editor window.
   * Publishes the component's props.
   * @fires component:edit
   * @param {object} e - Event object
   */
  handleConfigEdit: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Flux.doAction( constants.actions.COMPONENT_EDIT ,  this.props  );
  },

  /**
   * Stop event prop and push event to Queue, enabling global app to open the config editor window.
   * Publishes the component's props.
   * @fires component:add:new
   * @param e Event
   */
  handleConfigAdd: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Flux.doAction( constants.actions.COMPONENT_ADD ,  this.props);
  },

  /**
   * Remove selected component
   * @fires component:remove
   * @param e
   */
  handleConfigRemove: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Flux.doAction( constants.actions.COMPONENT_REMOVE ,  this.props);
  },

  /**
   * Show remove button unless the component is a page
   * @param type
   * @return {XML}
   */
  getRemoveButton: function(type){
    if(_.includes(allowedToRemove, type)){
      return (
        <span onClick={this.handleConfigRemove} className="remove-component">
          <span className="glyphicon glyphicon glyphicon-minus"></span>
        </span>
      );
    }
  },

  /**
   * Only show an add button if the component can have children(which 'field' and 'action' cannot).
   * @param {string} type - the type of component
   * @returns {JSX}
   */
  getAddButton: function(type){
    if(_.includes(allowedToAdd, type)){
      return (
        <span onClick={this.handleConfigAdd} className="add-component">
          <span className="glyphicon glyphicon glyphicon-plus"></span>
        </span>
      );
    }
  },

  /**
   * Create edit component HTML and handle click events.
   * @returns {JSX}
   */
  render: function() {
    return (
      <div className="config-editor">
        <span className="config-editor-label">{_.capitalize(this.props.componentType)}</span>
        {this.getRemoveButton(this.props.componentType.toLowerCase())}
        {this.getAddButton(this.props.componentType.toLowerCase())}
        <span onClick={this.handleConfigEdit} className="edit-component">
          <span className="glyphicon glyphicon-cog"></span>
        </span>
      </div>
    );
  }
});
