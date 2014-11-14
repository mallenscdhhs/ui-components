var React = require('react/addons');
var Action = require('./Action');
var Container = require('./Container');
var Fieldset = require('./Fieldset');

var Form = React.createClass({

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
    return (
    	<form key="formWithComponentsKey">
    		<legend className="field-label" key="legendFormKey">{this.props.name}</legend>
        <Container key="containerComponent">
          {this.getComponents()}
        </Container>
        <Container key="containerActions">
          {this.props.actions.map(function(action,i){
            return <Action type={action.type} {...action.config} key={"actionKey"+i} />
          })}
        </Container>
    	</form>
    );
  }

});

module.exports = Form;