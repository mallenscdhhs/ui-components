var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Container',

	/**
	* Render a Container component for form components.
	* @returns {JSX}
	*/
	render: function(){ 
		return (<div className={this.props.classes}>{this.props.children}</div>);
	}

});