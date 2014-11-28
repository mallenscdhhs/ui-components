describe('EventQueue', function(){
  var Q = require('../../src/EventQueue');
  
  describe('Subscribe', function(){
    it('Add callback to selected event namespace with unique Id', function(){
      Q.subscribe('test:event','myId',function(event){return event;});
      expect(Q.subs['test:event']['myId']).toBeDefined();
    });
  });

  describe('Unsubscribe', function(){
    it('Remove callback from selected event namespace based on unique Id', function(){
      Q.subscribe('test:event','myId',function(event){return event;});
      expect(Q.subs['test:event']['myId']).toBeDefined();
      Q.unSubscribe('test:event','myId');
      expect(Q.subs['test:event']['myId']).not.toBeDefined();
    });
  });
  
  describe('Messaging', function(){  
    var foo = null;

    beforeEach(function(done) {
      foo = {
        setBar: function(value) {   }
      }

      spyOn(foo, 'setBar');
      Q.subscribe('test:event','myId',foo.setBar);      
      Q.push({ 'entityEvent' : 'test:event', 'data' : { 'bar' : 'baz'} });   

      // Wait for message to be pushed back onto the eventloop, and notifiy subscribers
      setTimeout(function() {
        done();
      }, 100);
    });

    it('Put message on the queue and notify subscribers', function(){
      expect(foo.setBar.calls.count()).toEqual(1);
      expect(foo.setBar).toHaveBeenCalledWith({bar:'baz'});
    });    
  });

});