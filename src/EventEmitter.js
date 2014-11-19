var React = require('react/addons');

/**
 * This mixin adds pub-sub functionality to any Component.
 * @module EventEmitter
 */
module.exports = {
  /**
   * Maintains a hash of event types and their handlers.
   */
  events: {},

  /**
   * Register an event handler and optionally specify the scope
   * of the handler function(otherwise it is bound to the component).
   * @param {string} event - the event name
   * @param {function} handler - the event callback
   * @param {object} scope - the object that "this" points to within the handler
   */
  on: function(event, handler, scope){
    var cb = {fn: handler, scope: scope || this};
    var e = this.events[event];
    if ( e ) {
      e.push(cb);      
    } else {
      this.events[event] = [cb];
    }
  },

  /**
   * Deregister an event handler. Must be the exact same function passed
   * to EventEmitter#on.
   * @param {string} event - the event name
   * @param {function} handler - the handler function to remove
   */
  off: function(event, handler){
    var e = this.events[event];
    if ( e ) {
      this.events[event] = e.filter(function(obj){        
        return obj.fn !== handler;
      });
    }
  },

  /**
   * Fire all handlers registered with a specified event, and optionally pass
   * a data object to the handler functions.
   * @param {string} event - event name
   * @param {object} data 
   */
  triggerEvent: function(event, data){
    var e = this.events[event];    
    if ( e ) {
      e.forEach(function(handler){   
        if(handler.fn){
          handler.fn.call(handler.scope, data);
        }
      });
    }
  }
};