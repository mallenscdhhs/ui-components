var React = require("react");

/**
 * Renders a required field indicator if applicable.
 * @module RequiredIndicator
 */
module.exports = React.createClass({

  displayName: 'RequiredIndicator',

  propTypes: {
    required: React.PropTypes.bool
  },

  render: function(){
    return this.props.required? <span className="required">*</span> : null;
  }

});
