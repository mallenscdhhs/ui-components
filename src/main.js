'use-strict';
var React = require('react');
var update = require('react/lib/update');
var elements = require('./index');
var _ = require('lodash');
var constants = require('./constants');
var configuration = require('./configuration');
var ValidationStore = require('./ValidationStore');
var OptionsStore = require('./OptionsStore');

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
  var headId;
  while(head){
    headId = head.config.id || head._id;
    children = null;
    props = update(head, { config: {
      key: {$set: headId+ '-' +head.type},
      componentType: {$set: head.type}
    }});
    // if this is a form field, add the form-control class
    if( props.type === 'field' ) {
      props = update(head, { config: {
        className: {$set: 'form-control'}
      }});
    }
    // if this is a workflow, then add the items config
    if ( head.type === 'workflow' ) {
      props = update(props, {config: {
        firstPage: {$set: head.child },
        items: {$set: head.components}
      }});
    }
    // if there is a layout config then we need to insert
    // the layout into the binary tree to be rendered
    if ( props.config.layout ) {
      props = update(props, { config: {
        layout: {
          child: {$set: head.child},
          id: {$set: headId + '-layout'}
        }
      }});
      children = buildComponentTree(schema, props.config.layout);
    } else if ( props.child ) {
      children = buildComponentTree(schema, list[props.child]);
    }

    if ( props.type === 'field' && _.has(schema.model, props.config.id) ) {
      // checkboxes and radios need the "checked" property, not value
      if ( /checkbox|radio/.test(props.config.type) ) {
        // if model value is "true", then set "checked" to true
        if ( schema.model[props.config.id] === props.config.value ) {
          props = update(props, {config: {
            checked: { $set: true }
          }});
        }
      } else {
        props = update(props, { config: {
          value: {$set: schema.model[props.config.id]}
        }});
      }
    }

    element = elements[props.type];
    factory = React.createFactory(element);
    tree.push(factory(props.config, children));
    head = list[props.next];
  }
  return tree;
}

/**
 * Recursively builds up a component hierarchy.
 * @param {object} schema - the parent component schema
 * @returns {function} a ReactElement factory function
 */
function componentFactory(data){
  if ( !_.isEmpty(data.components) && !data.child ) throw new TypeError('You must provide a "child" property.');
  return buildComponentTree(data, data)[0];
}

/**
 * Pass-in any configuration needed to setup the Components library.
 * @param {object} data
 */
function configure(data){
  _.merge(configuration,data);
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
  'configure' : configure,
  'buildComponentTree': buildComponentTree,
  'factory': componentFactory
};
