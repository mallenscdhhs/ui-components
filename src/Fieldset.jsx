var React = require('react/addons');

module.exports = React.createClass({

  /**
   * Render a Fieldset component.
   * @returns {JSX}
   */
  render: function(){
    return (
      <fieldset key="fieldSetWithComponentsKey">
        <legend className="field-label" key="legendKey">{this.props.name}</legend>
        {this.props.children}
      </fieldset>
    );
  }

});