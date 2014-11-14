var React = require('react/addons');
var Layout = require('./Layout');
var Action = require('./Action');
var Container = require('./Container');

var Form = React.createClass({

  /**
   * Render a Form component.
   * @returns {JSX}
   */
  render: function(){ 
    return (
    	<form key="formWithComponentsKey">
    		<legend className="field-label" key="legendFormKey">{this.props.name}</legend>
        <Container>
          {this.props.actions.map(function(action,i){
            return <Action type={action.type} {...action.config} />
          })}
        </Container>
    	</form>
    );
  }

});

module.exports = Form;