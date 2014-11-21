var React = require('react/addons');
var Fieldset = require('./Fieldset');
var Container = require('./Container');
var Action = require('./Action');

module.exports = React.createClass({

  getDefaultProps: function(){
    return {
      name: '',
      actions: []
    };
  },

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
   * Render a Form component.
   * @returns {JSX}
   */
  render: function(){ 
    var formName = (this.props.name).replace(' ','_');
       
    return (
    	<form name={formName} key="formWithComponentsKey">
        {this.getComponents()}
        <Container classes="form-group" key="containerActions">
          {this.props.actions.map(function(action,i){
            return <Action type={action.type} {...action.config} key={"actionKey"+i} />
          })}
        </Container>
    	</form>
    );
  }

});