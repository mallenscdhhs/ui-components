'use-strict';
import InputMask from 'inputmask-core';
import _ from 'lodash';

let placeholderChar = ' ';
/**
 * An internal dictionary of format characters to use
 * with any mask that requires partial obfuscation.
 * @private
 */
let obfuscateFormatChars = {
  'x': {
    validate: char => char,
    transform: char => '*'
  }
};

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
    placeholderChar
  },
  zip: {
    pattern: '*****-****',
    placeholderChar
  },
  dateFormat: {
    pattern: '**/**/****',
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
