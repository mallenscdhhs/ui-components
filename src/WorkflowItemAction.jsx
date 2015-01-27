var Flux = require('fluxify');
var constants = require('./constants');
var React = require('react');
var _ = require('lodash');

/**
 * @module WorkflowItemAction
 */
module.exports = React.createClass({

  handleConfigEdit: function (e) {
    e.preventDefault();
    e.stopPropagation();
    //Flux.doAction( constants.actions.COMPONENT_EDIT ,  this.props  );
  },

  handleMoveUp: function (e) {
    e.preventDefault();
    e.stopPropagation();
    //Flux.doAction( constants.actions.COMPONENT_ADD ,  this.props);
  },

  handleMoveDown: function (e) {
    e.preventDefault();
    e.stopPropagation();
    //Flux.doAction( constants.actions.COMPONENT_REMOVE ,  this.props);
  },

  handleDisable: function (e) {
    e.preventDefault();
    e.stopPropagation();
    //Flux.doAction( constants.actions.COMPONENT_REMOVE ,  this.props);
  },

  getDisableButton: function(){
    return (
      <span onClick={this.handleDisable} className="workflow-disable-page">
        <span className="glyphicon glyphicon-chevron-down"></span>
      </span>
    );
  },

  getMoveDownButton: function(){
    return (
      <span onClick={this.handleMoveDown} className="workflow-move-down-page">
        <span className="glyphicon glyphicon-chevron-down"></span>
      </span>
    );
  },

  getMoveUpButton: function(){
    return (
      <span onClick={this.handleMoveUp} className="workflow-move-up-page">
        <span className="glyphicon glyphicon-chevron-up"></span>
      </span>
    );
  },

  getConfigButton: function(){
    return (
        <span onClick={this.handleConfigEdit} className="workflow-edit-page">
          <span className="glyphicon glyphicon-cog"></span>
        </span>
    );
  },

  render: function() {
    return (
      <div className="workflow-actions">
        {this.getDisableButton()}
        {this.getMoveDownButton()}
        {this.getMoveUpButton()}
        {this.getConfigButton()}
      </div>
    );
  }
});
