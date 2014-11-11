var React = require('react/addons');
var types = {
	'grid': require('./Grid')
};

/**
 * Represents a static layout configuration. A layout is independent
 * of the component(s) it displays. Therefore components can be added
 * or removed from a Layout without affecting the underlying layout structure.
 * @module Layout
 */
var Layout = React.createClass({
	propTypes: {
		components: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		type: React.PropTypes.string,
		config: React.PropTypes.object
	},
	
	/** 
	 * Every component that uses Layout must render their
	 * child components through Layout, so here we give the option to
	 * not specify a layout and just render the children. This prevents
	 * every component that wishes to use Layout from having to do existence
	 * checks in their render method.
	 * @returns {React.DOM}
	 */
	render: function(){
		var components = this.props.components;
		var cn = React.addons.classSet({
			'components': !this.props.type,
			'layout': !!this.props.type
		});
		var config = this.props;
		if ( this.props && this.props.type ) {
			if ( ! types[this.props.type] ) {
				config = this.props.config;
			}
			components = types[this.props.type](config);
		}
		return <div className={cn}>{components}</div>;
	}
});

module.exports = Layout;
