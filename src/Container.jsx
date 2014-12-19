'use-strict';
var React = require('react/addons');
var EditorMixin = require('./EditorMixin');

module.exports = React.createClass({
	displayName: 'Container',

	mixins: [EditorMixin],

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
      <div id={this.props.id} className={this.props.classes+' editable-component'}>
        {this.getEditTemplate()}{this.props.children}
      </div>
    );
	}

});