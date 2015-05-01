var React = require('react');
var Flux = require('fluxify');
var constants = require('./constants');
var _ = require('lodash');

/**
 * Handles the input change if passed mask, then passes the value and unmasked value to the onChange.
 * @module InputMaskUtils
 */
module.exports = {
  /**
   * Masks the value of an input component if a 'mask' string is provided.
   * @fires FIELD_VALUE_CHANGE
   * @param {object} event - config object passed in containing new, unmasked, and/or pasted values
   * @param {string} mask - format to be passed in for masking the input value. '0' represent
   * a character that should be masked, 'X' represents a character that should not be masked, and
   * any other character will be interpreted as a separator.
   * @param {string} customConfig.maskSymbol - optionally mask with a character other than
   * an asterisk
   * @param {string} customConfig.allowedStringType - optionally pass in regEx rules for
   * valid characters for the input value being masked, the default is numerals 0-9.
   */
  getMaskConfig: function(mask, customConfig) {
    var separator = '';
    var indexes = {
      mask: [],
      separator: []
    };
    _.forEach(mask, function(char, i) {
      if(char === '0') {
        indexes.mask.push(i);
      } else if(char !== 'X') {
        indexes.separator.push(i);
        separator = char;
      }
    });
    var maskConfig = {
      allowedStringType: customConfig.maskAllowedStringType ? customConfig.maskAllowedStringType : '0-9',
      symbol: customConfig.maskSymbol ? customConfig.maskSymbol : '*',
      separator: separator,
      maskIndex: indexes.mask,
      separatorIndex: indexes.separator
    };
    return maskConfig;
  },

  getRegEx: function(expressionString, stringType) {
    return new RegExp('[' + stringType + expressionString + ']', 'g');
  },

  applyMask: function(maskConfig, currentValue, allChars) {
    var newValue = '';
    var last = _.last(maskConfig.maskIndex);
    var separatorIndex = maskConfig.separatorIndex;
    var sepIdxLen = separatorIndex.length;
    var lastSep = _.last(separatorIndex);
    // if pasted, pre-mask all chars except those after the last maskIndex
    if(allChars) {
      var masked = '';
      var sepFollowingLast = _.includes(separatorIndex, last+1);
      var trailingSepAdjust = !sepFollowingLast ? 1 : 0;
      var firstUnmasked = '';
      if(sepFollowingLast) {
        if(sepFollowingLast === lastSep) {
          firstUnmasked = lastSep+1;
        } else {
          firstUnmasked = last+2;
        }
      } else {
        firstUnmasked = last+1;
      }
      var sepsBeforeFirstUnmasked = _.size(
        _.filter(separatorIndex, function(sepIdx) {
          return sepIdx < firstUnmasked;
        })
      );
      var sepsBeforeAdjust = sepsBeforeFirstUnmasked > 2 ? sepsBeforeFirstUnmasked-2 : 0;
      masked = _.map(currentValue.substr( 0, last-(trailingSepAdjust+sepsBeforeAdjust) ), function(char) {
        return char.replace(char, maskConfig.symbol);
      });
      masked = masked.join('');
      var remainder = currentValue.substr( last-(trailingSepAdjust+sepsBeforeAdjust) );
      currentValue = newValue.concat(masked, remainder);
    }
    // insert separators
    if(sepIdxLen !== 1) {
      if ( (currentValue.length > separatorIndex[0]) && (currentValue.length < separatorIndex[1]) ) {
        newValue += currentValue.substr(0, separatorIndex[0]) + maskConfig.separator;
        currentValue = currentValue.substr(separatorIndex[0]);
      }
      if(sepIdxLen > 2) {
        if ( (currentValue.length > ( separatorIndex[sepIdxLen-2]-(sepIdxLen-2)) ) && (currentValue.length < (separatorIndex[sepIdxLen-1]-1)) ) {
          newValue += currentValue.substr(0, separatorIndex[0]) + maskConfig.separator;
          newValue += _.times((sepIdxLen-2), function(i) {
            return currentValue.substr( separatorIndex[i], ( (separatorIndex[i+1]-separatorIndex[i])-1) ) + maskConfig.separator;
          }).join('');
          currentValue = currentValue.substr( (separatorIndex[sepIdxLen-2]-1) );
        }
      }
    }
    if ( currentValue.length > (separatorIndex[sepIdxLen-1] - (sepIdxLen-1)) ) {
      newValue += currentValue.substr(0, separatorIndex[0]) + maskConfig.separator;
      newValue += _.times((sepIdxLen-1), function(i) {
        return currentValue.substr( (separatorIndex[i]-i ), ((separatorIndex[1+i]-separatorIndex[i])-1) ) + maskConfig.separator;
      }).join('');
      currentValue = currentValue.substr(separatorIndex[sepIdxLen-1]-(sepIdxLen-1));
    }
    newValue += currentValue;
    return newValue;
  },

  getMaskedOutput: function(maskConfig, event) {
    var outputValue = '';
    var outputUnmasked = '';
    // handle backspacing
    var isBackspace = (event.keyPressed === constants.keyCodes.BACKSPACE);
    // get mask symbol & symbol separator
    var symb = this.getRegEx(maskConfig.symbol, maskConfig.allowedStringType);
    var sep = this.getRegEx(maskConfig.separator);
    // remove any char if not a number or maskSymbol
    var validChar = symb.test(event.target.value.slice(-1));
    if (validChar) {
      // filter out separators
      var filtered = event.target.value.replace(sep, '');
      var newUnmasked = filtered.slice(-1);
      // mask filtered chars
      var currentValue = filtered.slice(0, -1) + maskConfig.symbol;
      // don't mask after last maskIndex
      if ( currentValue.length > maskConfig.maskIndex.length ) {
        currentValue = filtered;
      }
      if(event.pasted) {
        outputValue = this.applyMask(maskConfig, event.pasted, true);
        outputUnmasked = event.pasted;
      } else {
        outputValue = this.applyMask(maskConfig, currentValue);
        outputUnmasked = isBackspace ? event.unmasked.slice(0, -1) : event.unmasked + newUnmasked;
      }
    } else {
      outputValue = event.target.value.slice(0, -1);
      outputUnmasked = isBackspace ? event.unmasked.slice(0, -1) : event.unmasked;
    }
    return {
      value: outputValue,
      unmasked: outputUnmasked
    };
  }
};
