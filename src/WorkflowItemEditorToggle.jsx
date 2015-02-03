var React = require('react');
var Flux = require('fluxify');
var constants = require('./constants');
var classSet = require('react/lib/cx');
var _ = require('lodash');

/**
 * Handles config opts for Workflow Items
 * @module WorkflowItemEditorToggle
 */
module.exports = React.createClass({

  propTypes: {
    id: React.PropTypes.string,
    active: React.PropTypes.bool
  },

  handleMoveUp: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Flux.doAction( constants.actions.MOVE_WORKFLOW_PAGE ,  this.props, 'UP');
  },

  handleMoveDown: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Flux.doAction( constants.actions.MOVE_WORKFLOW_PAGE ,  this.props, 'DOWN');
  },

  handleNest: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Flux.doAction( constants.actions.NEST_WORKFLOW_PAGE ,  this.props);
  },

  handleUnNest: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Flux.doAction( constants.actions.UNNEST_WORKFLOW_PAGE ,  this.props);
  },

  handleDisableToggle: function (e) {
    e.preventDefault();
    e.stopPropagation();
    var newActiveStatus = !this.state.active;
    Flux.doAction( constants.actions.TOGGLE_DISABLE_WORKFLOW_PAGE ,  this.props , newActiveStatus);
    this.setState({'active':newActiveStatus});
  },

  getInitialState : function(){
    return {
      'active' : this.props.active
    };
  },

  getClassNames: function(){
    return classSet({
      'glyphicon' : true,
      'glyphicon-check' : this.state.active,
      'glyphicon-unchecked' : !this.state.active
    });
  },

  getDisableButton: function(){
    return (
      <span onClick={this.handleDisableToggle} className="workflow-disable-page">
        <span className={this.getClassNames()}></span>
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

  getNestButton: function(){
    if(!this.props.children) {
      return (
        <span onClick={this.handleNest} className="workflow-nest-page">
          <span className="glyphicon glyphicon-chevron-right"></span>
        </span>
      );
    }
    return null;
  },

  getUnNestButton: function(){
    if(!this.props.children) {
      return (
        <span onClick={this.handleUnNest} className="workflow-un-nest-page">
          <span className="glyphicon glyphicon-chevron-left"></span>
        </span>
      );
    }
    return null;
  },

  render: function() {
    return (
      <div className="config-editor">
        {this.getDisableButton()}
        {this.getMoveDownButton()}
        {this.getMoveUpButton()}
        {this.getNestButton()}
        {this.getUnNestButton()}
      </div>
    );
  }
});
