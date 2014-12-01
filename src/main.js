var React = require('react/addons');
var elements = require('./index');
var _ = require('underscore');
var EventQueue = require('./EventQueue');
var Cache = require('./Cache');

/**
 * Recursively builds up a component hierarchy.
 * @param {object} schema - the parent component schema
 * @returns {function} a ReactElement factory function
 */

function componentFactory(schema){
	var element = elements[schema.type];
	var factory = React.createFactory(element);
	var config = _.clone(schema.config);
	var children = null;
	var layoutConfig = config.layout;

	if ( layoutConfig ) {		
		layoutConfig.config.components = config.components;
		children = componentFactory(layoutConfig);
	} else if ( config.components ) {
		children = config.components.map(componentFactory);	
	}

	return factory(config, children);
}

/**
 * This is the main API for the component library. You can use
 * any of the elements in a JSX environment, or you can generate
 * an entire ReactElement DOM by calling Components#factory.
 * @module Components
 */
module.exports = {
	elements: elements,
	factory: componentFactory,
	underscore: _,		// Remove when done testing workflow
	eventQueue: EventQueue,
	cache: Cache
};