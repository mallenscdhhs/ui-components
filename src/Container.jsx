'use-strict';
var React = require('react/addons');
var EditorMixin = require('./EditorMixin');

module.exports = React.createClass({
	displayName: 'Container',

	mixins: [EditorMixin],

	/**
	* Render a Container component for form components.
	* @returns {JSX}
	*/
	render: function(){ 
		return (<div className={this.props.classes+' editable-component'}>{this.getEditController("Container")}{this.props.children}</div>);
	}

});