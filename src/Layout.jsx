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
		if ( this.props && this.props.config ) {
			components = React.render(utils.initialCap(this.props.type), this.props);
		}
		return (
			<div className="layout">
				{components}
			</div>
		);
	}
});

module.exports = Layout;
