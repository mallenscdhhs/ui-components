var React = require('react/addons');

var Action = React.createClass({

  getURL: function(){
    var url = this.props.url;

    return url;
  },

  /**
   * Render a Action component.
   * @returns {JSX}
   */
  render: function(){ 
    return (
    	<a href={this.getURL()} key="actionKey">{this.props.name}</a>
    );
  }

});

module.exports = Action;