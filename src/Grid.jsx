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
 * Returns the correct component index to retrieve based on the current
 * row index, column index, and possible range offset.
 * @param {number} rowNum
 * @param {number} colNum
 * @param {number} rangeOffset
 * @returns {number}
 */
var getComponentIndex = function(rowNum, colNum, rangeOffset){
	var indx = colNum + rangeOffset;
	if ( rowNum > 0 ) {
		indx = this.props.rows[rowNum-1].length + (colNum +1) + rangeOffset;
	}
	return indx;
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
var renderRow = function(components, row, i, key){
	var componentIndexRange = 0;
	var componentList;
	return (
		<div className="row" key={"row-"+i+"-"+key}>
			{row.map(function(col, n){
				if ( col.indexRange ) {
					componentIndexRange += (col.indexRange[1] - 1);
					componentList = Array.prototype.slice.apply(components, col.indexRange);
				}	else {
					componentList = components[getComponentIndex.call(this, i, n, componentIndexRange)];
				}
				return renderColumn(componentList, col, n, key);
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
var renderColumn = function(components, col, n, key){
	return (
		<div className={getColumnClassNames(col)} key={"col-"+n+"-"+key}>
			{components}
		</div>
	);
};

/**
 * Takes a list of components and a list of grid row configs and produces
 * Bootstrap 3 grid markup.
 * @module Grid
 */
module.exports = React.createClass({
	displayName: 'Grid',

	propTypes: {
		rows: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.object)).isRequired		
	},

	render: function(){				
		var uniqueKey = this.props.name;	
		return (
			<div className="grid-layout" key={"layout-for-"+uniqueKey}>
			{this.props.rows.map(function(row, i){				
				return renderRow.call(this, this.props.children, row, i, uniqueKey);
			}, this)}
			</div>
		);
	}
});