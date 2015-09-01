'use-strict';
import InputMask from 'inputmask-core';

/**
 * An internal dictionary of format characters to use
 * with any mask that requires partial obfuscation.
 * @private
 */
let obfuscateFormatChars = {
  'x': {
    validate: char => /[0-9]/.test(char),
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
    pattern: 'xxx-xx-1111',
    formatCharacters: obfuscateFormatChars
  },
  ein: {
    pattern: 'xx-xxx1111',
    formatCharacters: obfuscateFormatChars
  },
  phone: {
    pattern: '111-111-1111'
  }
};

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
    mask.paste(value);
    return mask.getValue();
  }
};
