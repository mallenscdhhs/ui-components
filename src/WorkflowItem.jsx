'use-strict';
var React = require('react');
var Flux = require('fluxify');
var setClassNames = require('classnames');
var Tree = require('./Tree');
var constants = require('./constants');
var WorkflowItemEditorToggle = require('./WorkflowItemEditorToggle');

/**
 * Renders a single item in a Workflow Tree.
 * @module WorkflowItem
 */
module.exports = React.createClass({

  displayName: 'WorkflowItem',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    active: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    current: React.PropTypes.bool
  },

  getDefaultProps: function(){
    return {
      active: true,
      disabled: false,
      current : false
    };
  },

  handleClick: function(e){
    if(!this.props.disabled){
      Flux.doAction( constants.actions.TREE_LOAD_PAGE , { 'id' : this.props.id } );
    }
  },

  render: function(){
    var liClassNames = setClassNames({
      'inactive': !this.props.active,
      'current' : this.props.current,
      'disabled': this.props.disabled,
      'editable-component' : true
    });
    return (
      <li className={liClassNames} role="presentation">
        <WorkflowItemEditorToggle {...this.props} />
        <a href="javascript:void(0)" data-disabled={this.props.disabled} onClick={this.handleClick}>{this.props.title}</a>
        <Tree>{this.props.children}</Tree>
      </li>
    );
  }

});
