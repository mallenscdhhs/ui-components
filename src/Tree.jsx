'use-strict';
var React = require('react');
var EditorToggle = require('./EditorToggle');

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
          <EditorToggle {...this.props}/>
          {this.props.children}
        </ul>
      );
    } else {
      return null;
    }
  }
});
