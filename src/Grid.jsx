'use-strict';
var React = require('react');
var _ = require('lodash');
var Immutable = require('immutable');
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
 * Adds the children components to each column in sequence, distributing
 * components sequentially among available columns.
 * @param {array} rows
 * @param {array} components
 * @returns {array}
 */
var distributeComponents = function(rows, components){
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

  var extraRows = [];
  if ( index < components.length-1) {
    extraRows = _.map(components.slice(index+1), function(component){
      return [{
        md: '12',
        children: [component]
      }];
    });
  }
  return fullRows.concat(extraRows);
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
      var rows = distributeComponents(this.props.rows, this.props.children);
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
