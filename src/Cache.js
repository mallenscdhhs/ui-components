var _ = require('underscore');

module.exports = {
	
	/*
	* Cache Object
	*/
	cache : {},

	/*
	* Set cache data with passed in key
	* @returns {void}
	*/
	set: function(key,data){
		this.cache[key] = data;
	},

	/*
	* Get cache object based on passed in key  
	* @returns {Object}
	*/
	get: function(key){
		return this.cache[key];
	}

	// TODO: Use EventQueue to pub/sub for cache key changes.  
	// TODO: This is Similiar to queue model, but allows data to stay available unlike a queue.

}