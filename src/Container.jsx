var React = require('react/addons');

var Container = React.createClass({

  /**
   * Render a Container component.
   * @returns {JSX}
   */
  render: function(children){ 
    return (<div className="form-group">{children}</div>);
  }

});

module.exports = Container;