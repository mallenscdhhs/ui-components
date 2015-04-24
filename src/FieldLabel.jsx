var React = require("react");
var RequiredIndicator = require('./RequiredIndicator');
var Description = require('./Description');

/**
 * Determines whether to render a <label> or <legend> based on the
 * isFieldGroup property.
 * @module FieldLabel
 */
module.exports = React.createClass({

  displayName: 'FieldLabel',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    isFieldGroup: React.PropTypes.bool,
    required: React.PropTypes.bool
  },

  render: function(){
    var tagName = this.props.isFieldGroup? 'legend' : 'label';
    return React.createElement(
      tagName,
      {htmlFor: this.props.id},
      this.props.children,
      this.props.label,
      <RequiredIndicator {...this.props}/>,
      <Description key="description-text" {...this.props} />
    );
  }
});
