var setClassNames = require('classnames');

describe('classnames module', function() {

  it('keeps object keys with truthy values', function() {
    expect(
      setClassNames({
        a: true,
        b: false,
        c: 0,
        d: null,
        e: undefined,
        f: 1,
      })
    ).toEqual('a f');
  });

  it('joins arrays of class names and ignore falsy values', function() {
    expect( setClassNames('a', 0, null, undefined, true, 1, 'b') ).toEqual('a 1 b');
  });

  it('supports heterogenous arguments', function() {
    expect( setClassNames({a: true}, 'b', 0) ).toEqual('a b');
  });

  it('should be trimmed', function() {
    expect( setClassNames('', 'b', {}, '') ).toEqual('b');
  });

  it('returns an empty string for an empty configuration', function() {
    expect( setClassNames({}) ).toEqual('');
  });

  it('supports an array of class names', function() {
    expect( setClassNames(['a', 'b']) ).toEqual('a b');
  });

  it('joins array arguments with string arguments', function() {
    expect( setClassNames(['a', 'b'], 'c') ).toEqual('a b c');
    expect( setClassNames('c', ['a', 'b']) ).toEqual('c a b');
  });

  it('handles multiple array arguments', function() {
    expect( setClassNames(['a', 'b'], ['c', 'd']) ).toEqual('a b c d');
  });

  it('handles arrays that include falsy and true values', function() {
    expect( setClassNames(['a', 0, null, undefined, false, true, 'b']) ).toEqual('a b');
  });

  it('handles arrays that include arrays', function() {
    expect( setClassNames(['a', ['b', 'c']]) ).toEqual('a b c');
  });

  it('handles arrays that include objects', function() {
    expect( setClassNames(['a', {b: true, c: false}]) ).toEqual('a b');
  });

  it('handles deep array recursion', function() {
    expect( setClassNames(['a', ['b', ['c', {d: true}]]]) ).toEqual('a b c d');
  });

});
