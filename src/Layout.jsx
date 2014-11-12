var React = require('react/addons');

var types = {
	grid: React.createFactory(require('./Grid')),
	form: React.createFactory(require('./Form'))
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
		schema: React.PropTypes.object
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
		var components = this.props.components.map(function(schema){
			var componentType = types[schema.type];
			return ( componentType )? componentType(schema.config) : schema;
		});
		var cn = React.addons.classSet({
			'components': !this.props.schema,
			'layout': !!this.props.schema
		});
		var config, layoutType;
		if ( this.props.schema ) {
			config = this.props.schema.config;
			config.components = components;
			layoutType = types[this.props.schema.type];
			components = layoutType(config);
		}
		return <div className={cn}>{components}</div>;
	}
});

module.exports = Layout;
