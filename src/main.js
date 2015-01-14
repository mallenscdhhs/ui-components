'use-strict';
var React = require('react');
var update = require('react/lib/update');
var elements = require('./index');
var _ = require('lodash');
var constants = require('./constants');

/**
 * Recursively builds up a component hierarchy.
 * @param {object} schema - the parent component schema
 * @returns {function} a ReactElement factory function
 */
function componentFactory(data){
  if ( data.components && !data.child ) throw new TypeError('You must provide a "child" property.');
  return buildComponentTree(data, data)[0];
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
  var props;
  while(head){
    children = null;
    props = update(head, { config: {
      key: {$set: head.config.id+ '-' +head.type},
      componentType: {$set: head.type}
    }});
    // if there is a layout config then we need to insert
    // the layout into the binary tree to be rendered
    if ( props.config.layout ) {
      props = update(props, { config: {
        layout: {
          child: {$set: head.child},
          id: {$set: head.config.id + '-layout'}
        }
      }});
      children = buildComponentTree(schema, props.config.layout);
    } else if ( props.child ) {
      children = buildComponentTree(schema, list[props.child]);
    }

    if ( props.type === 'field' && _.has(schema.model, props.config.id) ) {
      props = update(props, { config: {
        value: {$set: schema.model[props.config.id]}
      }});
    }

    element = elements[props.type];
    factory = React.createFactory(element);
    tree.push(factory(props.config, children));
    head = list[props.next];
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
  'constants' : constants,
  'buildComponentTree': buildComponentTree,
  'factory': componentFactory
};
