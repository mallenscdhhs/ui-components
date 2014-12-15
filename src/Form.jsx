'use-strict';
var React = require('react/addons');
var _ = require('lodash');
var Container = require('./Container');
var Action = require('./Action');

module.exports = React.createClass({
  displayName: 'Form',

  getDefaultProps: function(){
    return {
      name: '',
      actions: []
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
    var formName = this.props.name ? (this.props.name).replace(/ /g,'_') : '';
    return (
      <form name={formName} key={"formWithComponentsKey"+formName}>
        {this.props.children}
        <Container classes="form-group" key={"containerActions"+formName}>{this.getActions()}</Container>
      </form>
    );
  }
  
});