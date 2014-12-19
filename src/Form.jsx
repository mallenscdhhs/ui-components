'use-strict';
var React = require('react/addons');
var _ = require('lodash');
var Container = require('./Container');
var Action = require('./Action');
var EditorMixin = require('./EditorMixin');

module.exports = React.createClass({
  displayName: 'Form',

  mixins: [EditorMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string
  },

  getDefaultProps: function(){
    return {
      name: '',
      componentType: 'form'
    };
  },

  /**
   * Render a Form component.
   * @returns {JSX} 
   */
  render: function(){
    return (
      <form name={this.props.name} id={this.props.id} key={this.props.id+"-form"} className="editable-component">
        {this.getEditTemplate()}
        {this.props.children}
      </form>
    );
  }
  
});