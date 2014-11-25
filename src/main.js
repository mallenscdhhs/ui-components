var React = require('react/addons');
var elements = require('./index');
var _ = require('underscore');

/**
 * Recursively builds up a component hierarchy.
 * @param {object} schema - the parent component schema
 * @returns {function} a ReactElement factory function
 */
 var level = 0;
 var iteration = 0;
function componentFactory(schema){
	var element = elements[schema.type];
	var factory = React.createFactory(element);
	var config = _.clone(schema.config);
	var children = null;
	var layoutConfig = config.layout;
	
	if ( layoutConfig ) {		
		layoutConfig.config.components = config.components;
		layoutConfig.config.name =  ( (schema.config && schema.config.name) ? ((schema.config.name).replace(/ /g,'_')).toLowerCase() : schema.type );
		level = 1;
		console.log('IN:LAYOUT:'+layoutConfig.config.name+':'+level+':');
		children = componentFactory(layoutConfig);
		console.log('OUT:LAYOUT:'+layoutConfig.config.name+':'+level+'::::::::::::::::::::');
	} else if ( config.components ) {
		level = 2;
		console.log('IN:PARENT:'+config.name+':'+level+':');
		children = config.components.map(componentFactory);	
		console.log('OUT:PARENT:'+config.name+':'+level+'::::::::::::::::::::');	
	}else{
		level = 3
		console.log('CHILD:'+config.name+':'+level+':');
	}


	console.log('RENDERING::::'+config.name);
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
	factory: componentFactory
};