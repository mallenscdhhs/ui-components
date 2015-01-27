'use-strict';
var React = require('react');

/**
 * A tree navigation component.
 * @module Tree
 */
module.exports = React.createClass({

  displayName: 'Tree',

  getDefaultProps: function(){
    return {
      componentType: 'tree'
    };
  },

  render: function(){
    if ( this.props.children ) {
      return (
        <ul className="nav nav-tree editable-component">
          {this.props.children}
        </ul>
      );
    } else {
      return null;
    }
  }
});
