'use-strict';
var React = require('react/addons');
var elements = require('./index');
var _ = require('lodash');
var EventQueue = require('./EventQueue');

/**
 * Recursively builds up a component hierarchy.
 * @param {object} schema - the parent component schema
 * @returns {function} a ReactElement factory function
 */
function componentFactory(schema){
  var element = elements[schema.type];
  var factory = React.createFactory(element);
  var children = null;
  var layoutConfig = schema.config.layout;

  if ( ! schema.config.component_id ) {
    schema.config.component_id = schema.id;
  }

  if ( layoutConfig ) {
    layoutConfig.components = schema.components;
    children = componentFactory(layoutConfig);
  } else if ( schema.components ) {
    children = schema.components.map(componentFactory);
  }

  return factory(schema.config, children);
}

/**
 * Take a linked list and build a nested tree structure from it.
 * @param {object} list - the linked list
 * @param {object} head - the first item in the list
 * @returns {array}
 */
function buildComponentTree(list, head){
  var tree = [];
  while(head){        
    var next = list[head.next];
    // is head a parent of next?
    if ( next && next.parentId && next.parentId === head.id ) {
      head.components = buildComponentTree(list, next);
      next = list[head.components.slice(-1)[0].next];
    }
    tree.push(head);
    // is head a child and is next a sibling?
    head = ( head.parentId && next && head.parentId !== next.parentId )? null : next;
  }
  return tree;
}

/**
 * This is the main API for the component library. You can use
 * any of the elements in a JSX environment, or you can generate
 * an entire ReactElement DOM by calling Components#factory.
 * @module Components
 */
module.exports = {
  elements: elements,
  eventQueue: EventQueue,
  buildComponentTree: buildComponentTree,
  factory: function(data){
    var schema = _.cloneDeep(data);
    if ( schema.components ){
      if ( !schema.componentHead ) throw new TypeError('You must supply a "componentHead".');
      schema.components = buildComponentTree(
        schema.components, 
        schema.components[schema.componentHead]);    
    } 
    return componentFactory(schema);
  }
};
