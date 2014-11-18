var React = require('react/addons');
var Components = require('./Components');

/**
 * Represents a static layout configuration. A layout is independent
 * of the component(s) it displays. Therefore components can be added
 * or removed from a Layout without affecting the underlying layout structure.
 * @module Layout
 */
var Layout = React.createClass({

	propTypes: {		
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
		var components = this.props.children;
		var cn = React.addons.classSet({
			'components': !this.props.schema,
			'layout': !!this.props.schema
		});
		var config;
		if ( this.props.schema ) {
			config = this.props.schema.config;
			config.children = this.props.children;			
			components = Components.factory(this.props.schema.type)(config);
		}
		return <div className={cn}>{components}</div>;
	}
});

module.exports = Layout;
