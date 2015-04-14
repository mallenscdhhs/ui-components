var React = require('react');

/**
 * Renders a single Bootstrap 3 grid row.
 * @module GridRow
 */
module.exports = React.createClass({

  displayName: 'GridRow',

  render: function(){
    return (
      <div className="row">
        {this.props.children}
      </div>
    );
  }
});
