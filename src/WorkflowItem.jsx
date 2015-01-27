'use-strict';
var React = require('react');
var Flux = require('fluxify');
var classSet = require('react/lib/cx');
var Tree = require('./Tree');
var constants = require('./constants');
var WorkflowItemAction = require('./WorkflowItemAction');

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
    disabled: React.PropTypes.bool
  },

  getDefaultProps: function(){
    return {
      active: false,
      disabled: false
    };
  },

  handleClick: function(e){
    if(!this.props.disabled){
      Flux.doAction( constants.actions.TREE_LOAD_PAGE , { 'id' : this.props.id } );
    }
  },

  render: function(){
    var liClassNames = classSet({
      active: this.props.active,
      disabled: this.props.disabled
    });
    return (
      <li className={liClassNames} role="presentation">
        <WorkflowItemAction {...this.props} />
        <a href="javascript:void(0)" data-disabled={this.props.disabled} onClick={this.handleClick}>{this.props.title}</a>
        <Tree>{this.props.children}</Tree>
      </li>
    );
  }

});
