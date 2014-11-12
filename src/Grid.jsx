var React = require('react/addons');
var _ = require('underscore');

/**
 * Returns a string of column size class names(from bootstrap 3).
 * @private
 * @param {object} col - contains sizes: { md: '3', sm: '3', xs: '12'}
 * @returns {string} "col-md-3 col-sm-3 col-xs-12"
 */
var getColumnClassNames = function(col){
	return _.map(_.pairs(_.pick(col, ['md', 'sm', 'xs'])), function(pair){
		pair.unshift('col');
		return pair.join('-');
	}).join(' ');
};

/**
 * Renders a row <div>. Computes the current componentIndex by either
 * examining the column config for an indexRange property to specify a
 * slice of the passed-in components array or by incrementing the componentIndex
 * by one and retreiving that specific component from the array.
 * @param {array} components - a list of components
 * @param {array} row - a list of row configs
 * @param {number} i - the current row index
 * @returns {React.DOM.div}
 */
var renderRow = function(components, row, i){
	var componentIndex = -1;
	var componentList;
	return (
		<div className="row" key={"row-"+i}>
			{row.map(function(col, n){
				if ( col.indexRange ) {
					componentIndex += col.indexRange.length;
					componentList = components.slice.apply(components, col.indexRange);
				}	else {
					componentIndex += 1;
					componentList = components[componentIndex];
				}
				renderColumn(componentList, col, n);
			}, this)}
		</div>
	);
};

/**
 * Renders a column <div>. Will add Bootstrap 3 column sizes.
 * @param {array} components - a list of components
 * @param {object} col - a column config
 * @param {number} n - the current column index
 * @returns {React.DOM.div}
 */
var renderColumn = function(components, col, n){
	return(
		<div className={getColumnClassNames(col)} key={"col-"+n}>
			{components}
		</div>
	);
};

/**
 * Takes a list of components and a list of grid row configs and produces
 * Bootstrap 3 grid markup.
 * @module Grid
 */
var Grid = React.createClass({
	propTypes: {
		rows: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.object)).isRequired,
		components: React.PropTypes.arrayOf(React.PropTypes.object)
	},
	render: function(){		
		var components = this.props.components || this.props.children;		
		return (
			<div className="grid-layout">
			{this.props.rows.map(function(row, i){				
				return renderRow.call(this, components, row, i);
			}, this)}
			</div>
		);
	}
});

module.exports = Grid;