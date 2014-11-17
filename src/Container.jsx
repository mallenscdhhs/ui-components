var React = require('react/addons');

var Container = React.createClass({

  /**
   * Render a Container component for form components.
   * @returns {JSX}
   */
  render: function(){ 
    return (<div className={this.props.classes}>{this.props.children}</div>);
  }

});

module.exports = Container;