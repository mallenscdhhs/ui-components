var React = require("react");

/**
 * Render a block of text to display as "help-block".
 * @module HelpBlock
 */
module.exports = React.createClass({

  displayName: 'HelpBlock',

  render: function(){
    return <p className="help-block">{this.props.children}</p>;
  }
});
