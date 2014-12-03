var React = require('react/addons');
var EventEmitter = require('./EventEmitter');
var _ = require('underscore');
var TreeItem = require('./TreeItem');

/**
 * Creates a list of <li> components and optionally renders
 * any nested components recursively.
 * @param {object} config
 * @returns {array}
 */
var renderItems = function(config){  
  return config.items.map(function(item, n){
    return (
      <TreeItem {...item} ref={item.pageId} key={item.pageId}>
        {renderTree.call(this, item)}
      </TreeItem>      
    );
  }, this);
};

/**
 * Creates a nested list structure recursively.
 * @param {object} config
 * @returns {React.DOM.ul}
 */
var renderTree = function(config){  
  return (config && config.items? 
    <ul className="nav nav-tree">
      {renderItems.call(this, config)}
    </ul> : null);
};

/**
 * A tree navigation component.
 * @module Tree
 */
module.exports = React.createClass({
  displayName: 'Tree',

  mixins: [EventEmitter],
  
  propTypes: {
    items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    startOn: React.PropTypes.string
  },
  
  render: function(){
    return renderTree.call(this, this.props);
  }
});