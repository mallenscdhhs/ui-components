var React = require('react/addons');
var Layout = require('./Layout');

var Form = React.createClass({

  /**
   * Render a Form component.
   * @returns {JSX}
   */
  render: function(){ 
    return (
    	<form key="formWithComponentsKey">
    		<legend className="field-label" key="legendFormKey">{this.props.name}</legend>
			<Layout schema={this.props.layout} components={this.props.components}/>
    	</form>
    );
  }

});

module.exports = Form;