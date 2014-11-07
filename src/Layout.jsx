var React = require('react/addons');
var utils = require('./utilities');
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
	render: function(){
		var components = this.props.components;
		var cn = React.addons.classSet({
			'components': !this.props.type,
			'layout': !!this.props.type
		});
		if ( this.props && this.props.type ) {
			components = React.render(utils.initialCap(this.props.type), this.props);
		}
		return <div className={cn}>{components}</div>;
	}
});

module.exports = Layout;
