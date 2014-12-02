var _ = require('underscore');

module.exports = {
	
	/*
	* List of event objects
	*/
	queue : [],

	/*
	* List of subscribers. 
	* ex. subs.['event:namespace']['subscriberUniqueId'] = callback()
	*/
	subscribers : {},

	/*
	* Push message onto queue.  
	* Format: {'entityEvent':'event:namespace','data':{'some':'data'}}
	* @returns {void}
	*/
	push: function(data){
		this.queue.push(data);
		this.notify();
	},

	/*
	* Called by 'push' method, when new message added to the queue.
	* Pulls latest messages off queue and pushes to subscribers
	* @returns {void}
	*/
	notify: function(){
		var key, ev;
		if(this.queue.length){
			while( this.queue.length ){
				ev = this.queue.shift();
				this.nofitySubscribers(ev.entityEvent,ev.data,ev.entityEvent);	
				this.nofitySubscribers('all',ev.data,ev.entityEvent);				
			}
		}
	},

	/*
	* Notifiy specified subscribers.
	* Push each notification callback into next loop of eventLoop so we don't block. 
	* @returns {void}
	*/
	nofitySubscribers: function(entityEvent,data,eventName){
		if(this.subscribers[entityEvent]){
			var subscribers = Object.keys(this.subscribers[entityEvent]);
			var mySubs = this.subscribers;
			_.each(subscribers,function(cbId,i){	
				var callback = mySubs[entityEvent][cbId];		
				setTimeout(function(){
					callback(data,eventName);
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
		if(!this.subscribers[entityEvent]){
			this.subscribers[entityEvent] = {};
		}
		this.subscribers[entityEvent][cbId] = cb;
	},

	/*
	* Update subs object by removing callback.
	* @returns {void}
	*/
	unSubscribe: function(entityEvent,cbId){
		delete this.subscribers[entityEvent][cbId];
	}


}