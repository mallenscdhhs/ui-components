var React = require('react/addons');
var cache = {};

/**
 * Creates factory methods for retrieving ReactElements and ReactElement factories.
 * We have to do this otherwise we cannot resolve the module dependencies at runtime
 * when generating Composite Elements on-the-fly.
 * @module Components
 */
module.exports = {

	/**
	 * Returns a ReactElement factory.
	 * @param {string} name - can be exact module name or all lowercase
	 * @returns {function}
	 */
	factory: function(name){
		return React.createFactory(this.element(name));
	},

	/**
	 * Returns a ReactElement Class for use in JSX. Internally looks up a
	 * module definition from require's cache if not already in cache object-
	 * so, your modules must be loaded into require's cache first(see amd/index.js and cjs/index.js).
	 * @param {string} name - can be exact module name or all lowercase
	 * @returns {ReactElement}
	 */
	element: function(name){
		var moduleName = name.slice(0,1).toUpperCase() + name.slice(1);
		var modulePath = './'+moduleName;
		if ( !cache[moduleName] ) {
			cache[moduleName] = require(modulePath);
		}
		return cache[moduleName];
	}
};
