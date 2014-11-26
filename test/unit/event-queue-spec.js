describe('EventQueue', function(){
  var Q = require('../../src/EventQueue');
  
  describe('Subscribe', function(){
    it('Add callback to selected event namespace with subscription ID', function(){
      Q.subscribe('test:event','myId',function(event){return event;});
      expect(Q.subs['test:event']['myId']).toBeDefined();
    });
  });

  describe('Unsubscribe', function(){
    it('can deregister an event handler', function(){
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
        setBar: function(value) {
          console.log('DONE'+value)
        }
      }

      spyOn(foo, 'setBar');

      Q.subscribe('test:event','myId', function(data){
        foo.setBar(data);
      });      

      Q.push({ 'entityEvent' : 'test:event', 'data' : { 'bar' : 'baz'} });   

      setTimeout(function() {
        done();
      }, 1200);
    });

    it('Put message on the queue and notify subscribers', function(){
      expect(foo.setBar.calls.count()).toEqual(1);
      expect(foo.setBar).toHaveBeenCalledWith({bar:'baz'});
    });    
  });

});