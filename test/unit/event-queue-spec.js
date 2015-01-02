var Queue = require('../../src/EventQueue');

describe('EventQueue', function(){
    
  describe('Subscribe', function(){
    it('Add callback to selected event namespace with unique Id', function(){
      Queue.subscribe('test:event','myId',function(event){return event;});
      expect(Queue.subscribers['test:event']['myId']).toBeDefined();
    });
  });

  describe('Unsubscribe', function(){
    it('Remove callback from selected event namespace based on unique Id', function(){
      Queue.subscribe('test:event','myId',function(event){return event;});
      expect(Queue.subscribers['test:event']['myId']).toBeDefined();
      Queue.unSubscribe('test:event','myId');
      expect(Queue.subscribers['test:event']['myId']).not.toBeDefined();
    });
  });
  
  describe('Notify', function(){  
    var foo = null;

    beforeEach(function(done) {
      foo = {
        setBar: function(value) {}
      };

      spyOn(foo, 'setBar');
      Queue.subscribe('test:event','myId',foo.setBar);      
      Queue.push({ 'entityEvent' : 'test:event', 'data' : { 'bar' : 'baz'} });   

      // Wait for message to be pushed back onto the eventloop, and notifiy subscribers
      setTimeout(function() {
        done();
      }, 100);
    });

    it('Put message on the queue and notify subscribers', function(){
      expect(foo.setBar.calls.count()).toEqual(1);
      expect(foo.setBar).toHaveBeenCalledWith({bar:'baz'},'test:event');
    });    
  });

});