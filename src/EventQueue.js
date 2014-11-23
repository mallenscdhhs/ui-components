window.q = [];
window.subs = {};
var _ = require('underscore');

module.exports = {

	push: function(data){
		q.push(data);
		this.notify();	
		console.log('Push:'+JSON.stringify(data));
	},

	notify: function(){
		var key, ev;
		if(q.length){
			for(var i=0;i<q.length;i++){
				ev = q.shift();
				this.nofitySubscribers(ev.entityEvent,ev.data);	
				this.nofitySubscribers('all',ev.data);				
			}
		}
	},

	nofitySubscribers: function(entityEvent,data){
		if(subs[entityEvent]){
			var subscribers = Object.keys(subs[entityEvent]);
			_.each(subscribers,function(cbId,i){			
				setTimeout(function(){
					console.log('Notified:'+entityEvent+':'+cbId+':'+JSON.stringify(data));
					subs[entityEvent][cbId](data);
				},0);
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
		if(!subs[entityEvent]){
			subs[entityEvent] = {};
		}
		subs[entityEvent][cbId] = cb;
		console.log('Subscribed:'+entityEvent+':'+cbId);
	},

	unSubscribe: function(entityEvent,cbId){
		delete subs[entityEvent][cbId];
		console.log('Unsubscribed:'+entityEvent+':'+cbId);
	}


}