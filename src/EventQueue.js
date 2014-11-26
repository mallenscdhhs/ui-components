var _ = require('underscore');

module.exports = {
	
	/*
	* List of event objects
	*/
	q : [],

	/*
	* List of subscribers. 
	* ex. subs.['event:namespace']['subscriberUniqueId'] = callback()
	*/
	subs : {},

	/*
	* Push message onto queue.  
	* Format: {'entityEvent':'event:namespace','data':{'some':'data'}}
	* @returns {void}
	*/
	push: function(data){
		this.q.push(data);
		this.notify();
	},

	/*
	* Called by 'push' method, when new message added to the queue.
	* Pulls latest messages off queue and pushes to subscribers
	* @returns {void}
	*/
	notify: function(){
		var key, ev;
		if(this.q.length){
			for( var i=0 ; i<this.q.length ; i++ ){
				ev = this.q.shift();
				this.nofitySubscribers(ev.entityEvent,ev.data);	
				this.nofitySubscribers('all',ev.data);				
			}
		}
	},

	/*
	* Notifiy specified subscribers.
	* Push each notification callback into next loop of eventLoop so we don't block. 
	* @returns {void}
	*/
	nofitySubscribers: function(entityEvent,data){
		if(this.subs[entityEvent]){
			var subscribers = Object.keys(this.subs[entityEvent]);
			var mySubs = this.subs;
			_.each(subscribers,function(cbId,i){	
				var callback = mySubs[entityEvent][cbId];		
				setTimeout(function(){
					callback(data);
				},0);
			});
		}
	},

	/*
	* Add callback to subscriber list, for the specified eventNamespace and unique subscriber Id
	* @returns {void}
	*/
	subscribe: function(entityEvent,cbId,cb){
		this.addSubscriber(entityEvent,cbId,cb);
	},

	/*
	* Add callback to the 'all' subscriber list, using unique subscriber Id
	* @returns {void}
	*/
	subscribeAll: function(cbId,cb){
		this.addSubscriber('all',cbId,cb);
	},

	/*
	* Update subs object with callback.
	* @returns {void}
	*/
	addSubscriber: function(entityEvent,cbId,cb){
		var isUnique = true;
		if(!this.subs[entityEvent]){
			this.subs[entityEvent] = {};
		}
		this.subs[entityEvent][cbId] = cb;
	},

	/*
	* Update subs object by removing callback.
	* @returns {void}
	*/
	unSubscribe: function(entityEvent,cbId){
		delete this.subs[entityEvent][cbId];
	}


}