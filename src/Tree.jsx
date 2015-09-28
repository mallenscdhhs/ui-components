'use-strict';
var React = require('react');

/**
 * A tree navigation component.
 * @module Tree
 */
class Tree extends React.Component {

  render(){
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
};

Tree.defaultProps = {
  componentType: 'tree'
};

export default Tree;
