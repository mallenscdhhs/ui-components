var EventEmitter = require('../../src/EventEmitter');

describe('EventEmitter mixin', function(){
  var handler = jasmine.createSpy('handler');
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
  describe('#triggerEvent', function(){});
});