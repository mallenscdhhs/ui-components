describe('Cache', function(){
  var Cache = require('../../src/Cache');
  
  it('Set key to passed in value.', function(){
    Cache.set('myTestKey',{'foo':'bar'});
    expect(Cache.cache['myTestKey'].foo).toEqual('bar');
  });

  it('Get value based on key.', function(){
    Cache.set('myTestKey',{'foo':'bar'});
    expect(Cache.get('myTestKey').foo).toEqual('bar');
  });

});