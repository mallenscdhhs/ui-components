var utils = require('../../src/utils');

describe('utils', function(){
  describe('#containsOneOf', function(){
    it('will return "true" if a list contains a value from another list', function(){
      expect(utils.containsOneOf([1,2,3,4], [0,1])).toEqual(true);
      expect(utils.containsOneOf(["a", "b", "c"], ["AA", "B", "c"])).toEqual(true);
      expect(utils.containsOneOf(["1", "2"], ["1", "2"])).toEqual(true);
    });
    it('will return "false" if a list does not contain a value from another list', function(){
      expect(utils.containsOneOf([1,2,3], [0, 4])).toEqual(false);
      expect(utils.containsOneOf(['a', 'b', 'c'], ['A', 'bee'])).toEqual(false);
    });
  });
});
