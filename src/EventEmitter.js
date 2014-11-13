var React = require('react/addons');

module.exports = {
  events: {},
  on: function(event, handler, scope){
    var cb = handler.bind(scope || this);
    var e = this.events[event];
    if ( e ) {
      e.push(cb);  
    } else {
      this.events[event] = [cb];
    }
  },
  off: function(event, handler){
    this.events[event] = this.events[event].filter(function(fn){
      return fn !== handler;
    });
  },
  triggerEvent: function(event, data){
    var e = this.events[event];
    if ( e ) {
      e.forEach(function(handler){
        handler(data);
      });
    }
  }
};