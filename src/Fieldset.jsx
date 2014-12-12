'use-strict';
var React = require('react/addons');

module.exports = React.createClass({
  displayName: 'Fieldset',
  /**
   * Render a Fieldset component.
   * @returns {JSX}
   */
  render: function(){
    var fsKey = this.props.name ? (this.props.name).replace(/ /g,'_') : '';
    return (
      <fieldset key={"fieldSetWithComponentsKey"+fsKey}>
        <legend className="field-label" key="legendKey">{this.props.name}</legend>
        {this.props.children}
      </fieldset>
    );
  }

});