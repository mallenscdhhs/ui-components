var React = require('react/addons');
var _ = require('underscore');

/**
 * Returns a string of column size class names(from bootstrap 3).
 * @private
 * @param {object} col - contains sizes: { md: '3', sm: '3', xs: '12'}
 * @returns {string} "col-md-3 col-sm-3 col-xs-12"
 */
var getColumnClassNames = function(col){
	return _.map(_.pairs(col), function(pair){
		pair.unshift('col');
		return pair.join('-');
	}).join(' ');
};

/**
 * Takes a list of components and a list of grid row configs and produces
 * Bootstrap 3 grid markup.
 * @module Grid
 */
var Grid = React.createClass({
	render: function(){
		var componentIndex = -1;
		return (
			<div className="grid-layout">
			{this.props.config.rows.map(function(row, i){				
				return (
					<div className="row">
						{row.map(function(col, n){							
							componentIndex+=1;
							return(
								<div className={getColumnClassNames(col)}>
									{this.props.components[componentIndex]}
								</div>
							);
						}, this)}
					</div>
				);
			}, this)}
			</div>
		);
	}
});

module.exports = Grid;