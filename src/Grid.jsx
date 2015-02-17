'use-strict';
var React = require('react');
var _ = require('lodash');
var GridRow = require('./GridRow');
var GridColumn = require('./GridColumn');
var update = require('react/lib/update');

/**
 * Add two numbers together.
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
var add = function(x, y){
  return x + y;
};

/**
 * If the current row number is greater than 0 we need to add
 * one to it in order to get the sequential column number.
 * @param {number} n - current row number
 * @returns {number};
 */
var getRowIndex = function(n){
  return n > 0? add(1, n) : n;
};

/**
 * Returns the total number of columns in a given
 * array of rows.
 * @param {array} rows
 * @returns {number}
 */
var getTotalColumns = function(rows){
  return _.reduce(rows, function(n, row, i){
    return n + row.length;
  }, 0);
};

/**
 * Take a given number(num) and produce a list of values
 * that are cumulative sums of (num + mod) up to a limit(len).
 * @example:
 *  distributeIndexes(10, 3, 0) = [0,3,6,9]
 * @param {number} len - number to count to
 * @param {number} num - number to start at
 * @param {number} mod - number to cumulate with
 */
var distributeIndexes = function(len, mod, num){
  var result = [];
  while(num < len){
    result.push(num);
    num = num + mod;
  }
  return result;
};

/**
 * Adds the children components to each column in sequence, distributing
 * components sequentially among available columns.
 * @param {array} rows
 * @param {array} components
 * @param {function} indexDistro - the function that calculates the indexes of the
 *   components that belong to the current column
 * @returns {array}
 */
var distributeComponents = function(rows, components, indexDistro){
  // Fill available rows/columns with components
  var index = -1;
  var fullRows = _.map(rows, function(row, i){
    return _.map(row, function(col, n){
      index = index + 1;
      return update(col, {
        children: {
          $set: _.at(components, index)
        }
      });
    });
  });

  // If there are more components than rows/cols, push new row & col to hold each extra component
  while(index < components.length-1){
    index = index + 1;
    var newRowCol = [{
      "md" : "12",
      "children" : _.at(components, index)
    }];
    fullRows.push(newRowCol);
  }

  return fullRows;
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

  statics: {
    add: add,
    getTotalColumns: getTotalColumns,
    getRowIndex: getRowIndex,
    distributeIndexes: distributeIndexes,
    distributeComponents: distributeComponents
  },

  getDefaultProps: function(){
    return {
      componentType: 'layout'
    };
  },

  render: function(){
    var numChildren = this.props.children ? this.props.children.length : 0;
    if(numChildren) {
      var numColumns = getTotalColumns(this.props.rows);
      var indexDistro = distributeIndexes.bind(this, numChildren, numColumns);
      var rows = distributeComponents(this.props.rows, this.props.children, indexDistro);

      return (
        <div className="grid-layout">
        {_.map(rows, function (row, i) {
          return (
            <GridRow>
              {_.map(row, function (col) {
                return <GridColumn {...col}/>;
              })}
            </GridRow>
          );
        })}
        </div>
      );
    }else{
      return (<div className="grid-layout"></div>);
    }
  }
});
