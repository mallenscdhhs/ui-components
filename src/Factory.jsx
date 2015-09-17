'use-strict';
import React from 'react';
import _ from 'lodash';

/**
 * An element/static method for creating a DOM structure from JSON.
 * @class Factory
 */
class Factory extends React.Component {
  /**
   * Builds a React component tree from passed-in configuration. Uses depth-first
   * traversal to recursively process the binary tree data in schema.components.
   * @param {object} elements - an object containing the React components
   * @param {object} schema - the root component schema to parse
   * @param {object} head - the current component schema
   * @returns {object[]}
   */
  static build(elements, schema, head){
    // short circuit if any of the arguments are missing
    if ( !elements ) throw new TypeError('You must provide a list of elements to Factory#build.');
    if ( !schema ) throw new TypeError('You must provide a root schema to Factory#build.');

    let tree = [];
    let list = schema.components || {};
    let element, elementFactory, props, children;

    while(head) {
      children = null;
      element = elements[head.type];
      elementFactory = React.createFactory(element);
      props = head.config;
      props.key = _.uniqueId(head.type+'-');
      tree.push(elementFactory(props, Factory.build(elements, schema, list[head.child])));
      head = list[head.next];
    }

    return tree;
  };

  render(){
    if ( this.props.elements && this.props.schema && this.props.head ) {
      return Factory.build(this.props.elements, this.props.schema, this.props.head)[0];
    } else {
      return <div/>;
    }
  }
}

Factory.defaultProps = {
  schema: null,
  head: null,
  elements: null
};

Factory.propTypes = {
  elements: React.PropTypes.object.isRequired,
  head: React.PropTypes.object.isRequired,
  schema: React.PropTypes.shape({
    type: React.PropTypes.string.isRequired,
    config: React.PropTypes.object.isRequired,
    child: React.PropTypes.string,
    model: React.PropTypes.object
  }).isRequired
};

export default Factory;
