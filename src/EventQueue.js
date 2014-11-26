var _ = require('underscore');

module.exports = {
	
	q : [],

	subs : {},

	push: function(data){
		this.q.push(data);
		this.notify();	
		//console.log('Push:'+JSON.stringify(data));
	},

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

	nofitySubscribers: function(entityEvent,data){
		if(this.subs[entityEvent]){
			var subscribers = Object.keys(this.subs[entityEvent]);
			var mySubs = this.subs;
			_.each(subscribers,function(cbId,i){	
				var callback = mySubs[entityEvent][cbId];		
				//setTimeout(function(){
					console.log('Notified:'+entityEvent+':'+cbId+':'+JSON.stringify(data));
					callback(data);
				//},0);
			});
		}
	},

	subscribe: function(entityEvent,cbId,cb){
		this.addSubscriber(entityEvent,cbId,cb);
	},

	subscribeAll: function(cbId,cb){
		this.addSubscriber('all',cbId,cb);
	},

	addSubscriber: function(entityEvent,cbId,cb){
		var isUnique = true;
		if(!this.subs[entityEvent]){
			this.subs[entityEvent] = {};
		}
		this.subs[entityEvent][cbId] = cb;
		console.log('Subscribed:'+entityEvent+':'+cbId);
	},

	unSubscribe: function(entityEvent,cbId){
		delete this.subs[entityEvent][cbId];
		console.log('Unsubscribed:'+entityEvent+':'+cbId);
	}


}