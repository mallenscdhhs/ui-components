var React = require('react/addons');

var Container = React.createClass({

  /**
   * Render a Container component for form components.
   * @returns {JSX}
   */
  render: function(children){ 
    return (<div className="form-group">{this.props.children}</div>);
  }

});

module.exports = Container;