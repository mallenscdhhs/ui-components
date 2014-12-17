'use-strict';
var React = require('react/addons');
var _ = require('lodash');
var Container = require('./Container');
var Action = require('./Action');
var EditorMixin = require('./EditorMixin');

module.exports = React.createClass({
  displayName: 'Form',

  mixins: [EditorMixin],

  getDefaultProps: function(){
    return {
      name: ''
    };
  },

  /**
   * Create actions component template
   * @returns {JSX Template} 
   */
  getActions: function(){
    var actions;
    if(this.props.actions){
      actions = _.map(this.props.actions, function(action,i){
        return <Action type={action.type} {...action.config} key={"action"+i} />
      }, this);       
    }
    return actions;
  },

  /**
   * Render a Form component.
   * @returns {JSX} 
   */
  render: function(){
    return (
      <form name={this.props.id} id={this.props.id} key={"formWithComponentsKey"+this.props.id} className="editable-component">
        {this.getEditController("Form")}
        {this.props.children}
      </form>
    );
  }
  
});