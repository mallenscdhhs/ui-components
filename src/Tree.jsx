'use-strict';
var React = require('react');
import renderChildren from './render-children';

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
        <ul className="nav nav-tree">
          {this.props.children}
        </ul>
      );
    } else {
      return null;
    }
  }
});
