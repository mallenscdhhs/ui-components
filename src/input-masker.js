'use-strict';
import InputMask from 'inputmask-core';
import _ from 'lodash';

let placeholderChar = ' ';

/**
 * Accept all character types in a mask pattern.
 * @private
 */
let allTypesFormatChars = {
  '*': {
    validate: char => char,
    transform: char => char
  }
};

/**
 * An internal dictionary of format characters to use
 * with any mask that requires partial obfuscation.
 * @private
 */
let obfuscateFormatChars = _.merge({
  x: {
    validate: char => char,
    transform: char => '*'
  }
}, allTypesFormatChars);

/**
 * Internal dictionary of custom masks. These keys will correspond to the value
 * of the "mask" property in the component config.
 * @private
 */
let masks = {
  ssn: {
    pattern: 'xxx-xx-****',
    formatCharacters: obfuscateFormatChars,
    placeholderChar
  },
  ein: {
    pattern: 'xx-xxx****',
    formatCharacters: obfuscateFormatChars,
    placeholderChar
  },
  phone: {
    pattern: '***-***-****',
    formatCharacters: allTypesFormatChars,
    placeholderChar
  },
  zip: {
    pattern: '*****-****',
    formatCharacters: allTypesFormatChars,
    placeholderChar
  }
};

/**
 * @module input-masker
 */
export default {
  /**
   * Uses the given maskName to create the appropriate InputMask instance and
   * returns the result of the mask.
   * @param {string} maskName - one of 'ssn', 'ein', or 'phone'
   * @param {string} value - the raw input value to mask
   * @returns {string} the masked value
   */
  mask(maskName, value) {
    let maskConfig = masks[maskName];
    let mask = new InputMask(maskConfig);
    mask.setValue(value);
    let maskedValueBuffer = mask.value;
    let sliceIndex = _.indexOf(maskedValueBuffer, placeholderChar);
    let maskedValue = mask.getValue();
    return sliceIndex >= 0 ? maskedValue.slice(0, sliceIndex) : maskedValue;
  }
};
