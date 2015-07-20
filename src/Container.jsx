'use-strict';
var React = require('react');

module.exports = React.createClass({
	displayName: 'Container',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    classNames: React.PropTypes.string
  },

	/**
	* Render a Container component for form components.
	* @returns {JSX}
	*/
	render: function(){
		return (
      <div id={this.props.id} className={this.props.classes}>
        {this.props.children}
      </div>
    );
	}

});
