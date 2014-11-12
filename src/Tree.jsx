var React = require('react/addons');

/**
 * Creates a list of <li> components and optionally renders
 * any nested components recursively.
 * @param {object} config
 * @returns {array}
 */
var renderItems = function(config){
	return config.items.map(function(item, n){
		return (
			<li role="presentation" key={"tree-item"+n}>
				<a href={item.pageId}>{item.title}</a>
				{renderTree(item)}
			</li>
		);
	});
};

/**
 * Creates a nested list structure recursively.
 * @param {object} config
 * @returns {React.DOM.ul}
 */
var renderTree = function(config){	
	return (config && config.items? 
		<ul className="nav tree-nav">
			{renderItems(config)}
		</ul> : null);
};

/**
 * A tree navigation component.
 * @module Tree
 */
var Tree = React.createClass({
	propTypes: {
		items: React.PropTypes.arrayOf(React.PropTypes.object)
	},
	getInitialState: function(){
		return this.props;
	},
	render: function(){
		return renderTree(this.state);
	}
});

module.exports = Tree;