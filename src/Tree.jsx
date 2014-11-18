var React = require('react/addons');
var EventEmitter = require('./EventEmitter');
var Components = require('./Components');
var TreeItem = Components.element('TreeItem');
var _ = require('underscore');

/**
 * Creates a list of <li> components and optionally renders
 * any nested components recursively.
 * @param {object} config
 * @returns {array}
 */
var renderItems = function(config){
  return config.items.map(function(item, n){
    item.active = this.state.selectedItem === item.pageId;
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
    <ul className="nav nav-tree" onClick={this.handleClick}>
      {renderItems.call(this, config)}
    </ul> : null);
};

/**
 * A tree navigation component.
 * @module Tree
 */
var Tree = React.createClass({
  mixins: [EventEmitter],
  
  propTypes: {
    items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    startOn: React.PropTypes.string
  },
  
  getInitialState: function(){    
    return {
      selectedItem: ''
    };
  },

  handleClick: function(e){
    if ( e.target.dataset.disabled !== 'true' ) {
      var pageId = e.target.hash.slice(1);     
      e.preventDefault();
      e.stopPropagation(); 
      this.setState({selectedItem: pageId});
      this.refs[pageId].setState({
        active: true,
        disabled: false
      });
      if ( this.state.selectedItem && this.state.selectedItem !== pageId ) {
        this.refs[this.state.selectedItem].setState({
          active: false
        });        
      } 
      this.triggerEvent('item:select', pageId);
    }    
  },
  
  selectItem: function(pageId){    
    this.refs[pageId].getDOMNode().childNodes[0].click();
  },
  
  render: function(){
    return renderTree.call(this, this.props);
  }
});

module.exports = Tree;
