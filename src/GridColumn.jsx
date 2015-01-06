var React = require('react');
var _ = require('lodash');

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
 * Renders a single Bootstrap 3 column.
 * @module Column
 */
module.exports = React.createClass({

  displayName: 'GridColumn',

  propTypes: {
    id: React.PropTypes.string,
    md: React.PropTypes.string,
    sm: React.PropTypes.string,
    xs: React.PropTypes.string
  },

  statics: {
    getColumnClassNames: getColumnClassNames
  },

  render: function(){
    var attr = _.pick(this.props, 'id');
    return <div {...attr} className={getColumnClassNames(this.props)}>{this.props.children}</div>;
  }
});
