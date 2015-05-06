'use-strict';
var React = require('react');
var Immutable = require('immutable');
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
  var iList = Immutable.Map(list);
  var element, factory, props, children, iHead, iModel;
  while(head){
    children = null;
    element = elements[head.type];
    factory = React.createFactory(element);
    iHead = Immutable.fromJS(head);
    iModel = Immutable.Map(schema.model);
    props = element.configure? element.configure(iHead, iModel, iList) : head.config;
    if ( head.child ) {
      children = buildComponentTree(schema, list[head.child]);
    }
    tree.push(factory(props, children));
    head = list[head.next];
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
