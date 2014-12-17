'use-strict';
var React = require('react/addons');
var elements = require('./index');
var _ = require('lodash');
var EventQueue = require('./EventQueue');
var EditorConfig = require('./EditorConfig');

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

  schema.config.key = schema.config.id;

  if ( layoutConfig ) {
    layoutConfig.components = schema.components ? schema.components : schema.config.components ;
    children = componentFactory(layoutConfig);
  } else if ( schema.components ) {
    children = schema.components.map(componentFactory);
  } else if ( schema.config.components ) {
    children = schema.config.components.map(componentFactory);
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
    if ( head.child ) {
      head.components = buildComponentTree(list, list[head.child]);
    }
    tree.push(head);
    head = list[head.next];
  }
  return tree;
}

function factory(data){
  var schema = _.cloneDeep(data);
  if ( schema.components && !!schema.componentHead){
    if ( !schema.componentHead ) throw new TypeError('You must supply a "componentHead".');
    schema.components = buildComponentTree(
        schema.components,
        schema.components[schema.componentHead]);
  }
  return componentFactory(schema);
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
  'editorConfig': EditorConfig,
  'buildComponentTree': buildComponentTree,
  'factory':factory
};
