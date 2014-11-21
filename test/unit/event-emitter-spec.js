describe('EventEmitter mixin', function(){
  var EventEmitter = require('../../src/EventEmitter');
  
  var handler = function(data){
    return data;
  };

  describe('#on', function(){
    it('can register new events', function(){
      expect(EventEmitter.events['foo']).not.toBeDefined();
      EventEmitter.on('foo', handler);
      expect(EventEmitter.events.foo).toBeDefined();
      expect(EventEmitter.events.foo.length).toEqual(1);
    });
  });

  describe('#off', function(){
    it('can deregister an event handler', function(){
      EventEmitter.off('foo', handler);
      expect(EventEmitter.events.foo.length).toEqual(0);
    });
  });
  
  describe('#triggerEvent', function(){    
    it('can fire handlers registered to an event', function(){
      var test = {
        handler: function(data){}
      };
      spyOn(test, 'handler');
      EventEmitter.on('foo', test.handler);      
      EventEmitter.triggerEvent('foo', {bar: 'baz'});
      expect(test.handler.calls.count()).toEqual(1);
      expect(test.handler).toHaveBeenCalledWith({bar:'baz'});
    });    
  });
});