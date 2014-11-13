var React = require('react/addons');
var Layout = require('./Layout');

var Fieldset = React.createClass({
  
  /**
   * Render a Fieldset component.
   * @returns {JSX}
   */
  render: function(){
    return (
        <fieldset key="fieldSetWithComponentsKey">
          <legend className="field-label" key="legendKey">{this.props.name}</legend>
          <Layout schema={this.props.layout} components={this.props.components}/>
        </fieldset>
      );
  }

});

module.exports = Fieldset;