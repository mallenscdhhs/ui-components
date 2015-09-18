'use-strict';
import masker from '../../src/input-masker';

describe('input-masker', () => {
  it('can mask SSN numbers', () => {
    let result = masker.mask('ssn', '123456789');
    expect(result).toBe('***-**-6789');
    let incompleteResult = masker.mask('ssn', '1234');
    expect(incompleteResult).toBe('***-*');
  });

  it('can mask EIN numbers', () => {
    let result = masker.mask('ein', '223334444');
    expect(result).toBe('**-***4444');
    let incompleteResult = masker.mask('ein', '2233');
    expect(incompleteResult).toBe('**-**');
  });

  it('can mask phone numbers', () => {
    let result = masker.mask('phone', '8883334444');
    expect(result).toBe('888-333-4444');
    let incompleteResult = masker.mask('phone', '8883');
    expect(incompleteResult).toBe('888-3');
  });

  it('can mask zip codes', () => {
    let result = masker.mask('zip', '123451234');
    expect(result).toBe('12345-1234');
    let incompleteResult = masker.mask('zip', '123456');
    expect(incompleteResult).toBe('12345-6');
  });
});
