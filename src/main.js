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
function componentFactory(data){
  if ( data.components && !data.child ) throw new TypeError('You must provide a "child" property.');
  var schema = _.cloneDeep(data);
  return buildComponentTree(schema, schema)[0];
}

/**
 * Take a binary tree and build a nested tree structure from it.
 * @param {object} schema - the top-level component schema
 * @param {object} head - the first item in the list
 * @returns {array}
 */
function buildComponentTree(schema, head){
  var tree = [];
  var list = schema.components || {};
  var children = null;
  var element, factory;
  while(head){
    children = null;
    // if there is a layout config then we need to insert
    // the layout into the binary tree to be rendered
    if ( head.config.layout ) {
      head.config.layout.child = head.child;
      head.config.layout.id = head.config.id + '-layout';      
      children = buildComponentTree(schema, head.config.layout);
    } else if ( head.child ) {
      children = buildComponentTree(schema, list[head.child]);
    }
    
    if ( head.type === 'field' && _.has(schema.model, head.config.name) ) {
      head.config.value = schema.model[head.config.name];
    }

    head.config.key = head.config.id+'-'+head.type;
    head.config.componentType = head.type;

    element = elements[head.type];
    factory = React.createFactory(element);
    tree.push(factory(head.config, children));
    head = list[head.next];
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
  'elements': elements,
  'eventQueue': EventQueue,
  'buildComponentTree': buildComponentTree,
  'factory': componentFactory
};