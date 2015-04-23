var React = require("react");
var Description = require('./Description');

/**
 * Render a block of text to display as "help-block".
 * @module HelpBlock
 */
module.exports = React.createClass({

  displayName: 'HelpBlock',

  render: function(){
    return (<p id={this.props.id + '-help-block'} className="help-block">
              <Description key="description-text" {...this.props} />
              {this.props.children}
            </p>);
  }
});
