var React = require('react/addons');
var Components = require('./Components');
var Action = Components.element('action');
var Container = Components.element('container');
var Fieldset = Components.element('fieldset');
var Layout = Components.element('layout');

var Form = React.createClass({

  /**
   * Create components template
   * @returns {JSX Template} 
   */
  getComponents: function(){
    var comps;
    if(this.props.components){
      comps = this.props.components.map(function(fieldset,i){
        return <Fieldset {...fieldset.config} key={"fieldsetKey"+i} />
      });  
    }
    return comps;
  },

  /**
   * Create actions component template
   * @returns {JSX Template} 
   */
  getActions: function(){
    var actions;
    if(this.props.actions){
      actions = this.props.actions.map(function(action,i){
        return <Action type={action.type} {...action.config} key={"actionKey"+i} />
      });       
    }
    return actions;
  },

  /**
   * Render a Form component.
   * @returns {JSX} 
   */
  render: function(){ 
    var formName = this.props.name ? (this.props.name).replace(' ','_') : '';
    return (
      <form name={formName} key="formWithComponentsKey">
        {this.getComponents()}
        <Container classes="form-group" key="containerActions">{this.getActions()}</Container>
      </form>
    );
  }

});

module.exports = Form;