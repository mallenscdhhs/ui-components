'use-strict';
var React = require('react/addons');
var EditorToggle = require('./EditorToggle');

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
      <div id={this.props.id} className={this.props.classes+' editable-component'}>
        <EditorToggle {...this.props}/>
        {this.props.children}
      </div>
    );
	}

});