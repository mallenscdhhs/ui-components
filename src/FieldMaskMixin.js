var React = require('react');
var Flux = require('fluxify');
var constants = require('./constants');
var _ = require('lodash');

/**
 * Handles the mask change if passed into the onChange event for an input field.
 * @module FieldMaskMixin
 */
module.exports = {
  /**
   * Masks the value of an input component if a 'mask' string is provided.
   * @fires FIELD_VALUE_CHANGE
   * @param {object} payload - config object passed in containing new value and unmasked value
   * @param {boolean} pasted - boolean indicating whether or not the new value was pasted
   * @param {string} this.props.mask - format to be passed in for masking the input value.
   * '0' represent a character that should be masked, 'X' represents a character that should
   * not be masked, and any other character will be interpreted as a separator.
   * @param {string} this.props.maskSymbol - optionally mask with a character other than an asterisk
   * @param {string} this.props.allowedStringType - optionally pass in regEx rules for valid
   * characters for the input value being masked, the default is numerals 0-9.
   */
  handleKeyDown: function(e) {
    this.setState({
      keyPressed: e.which
    });
  },

  handlePaste: function(e) {
    var pasted = e.clipboardData.getData('Text');
    var self = this;
    e.preventDefault();
    _.forEach(pasted, function(char) {
      self.onChange({target: {value: char}, pasted: pasted});
    });
  },

  getMaskPattern: function() {
    var separator = '';
    var indexes = {
      mask: [],
      separator: []
    };
    _.forEach(this.props.mask, function(char, i) {
      if(char === '0') {
        indexes.mask.push(i);
      } else if(char !== 'X') {
        indexes.separator.push(i);
        separator = char;
      }
    });
    this.setState({
      maskConfig: {
        allowedStringType: this.props.maskAllowedStringType ? this.props.maskAllowedStringType : '0-9',
        symbol: this.props.maskSymbol ? this.props.maskSymbol : '*',
        separator: separator,
        maskIndex: indexes.mask,
        separatorIndex: indexes.separator
      }
    });
  },

  getRegEx: function(expressionString, stringType) {
    return new RegExp('[' + stringType + expressionString + ']', 'g');
  },

  setMask: function(currentValue, allChars) {
    var config = this.state.maskConfig;
    var newValue = '';
    var last = _.last(this.state.maskConfig.maskIndex);
    // if pasted, pre-mask all chars except those after the last maskIndex
    if(allChars) {
      var masked = '';
      if (currentValue.length > last) {
        masked = _.map(currentValue.substr(0, _.last(this.state.maskConfig.maskIndex)), function(char) {
          return char.replace(char, config.symbol);
        });
        masked = masked.join('');
        var remainder = currentValue.substr(last);
        currentValue = newValue.concat(masked, remainder);
      } else {
        masked = _.map(currentValue, function(char) {
          return char.replace(char, config.symbol);
        });
        currentValue = masked.join('');
      }
    }
    // insert separators
    var separatorIndex = this.state.maskConfig.separatorIndex;
    var sepIdxLen = separatorIndex.length;
    var lastSep = _.last(separatorIndex);
    if(sepIdxLen !== 1) {
      if ( (currentValue.length > separatorIndex[0]) && (currentValue.length < separatorIndex[1]) ) {
        newValue += currentValue.substr(0, separatorIndex[0]) + config.separator;
        currentValue = currentValue.substr(separatorIndex[0]);
      }
      if(sepIdxLen > 2) {
        if ( (currentValue.length > ( separatorIndex[sepIdxLen-2]-(sepIdxLen-2)) ) && (currentValue.length < (separatorIndex[sepIdxLen-1]-1)) ) {
          newValue += currentValue.substr(0, separatorIndex[0]) + config.separator;
          newValue += _.times((sepIdxLen-2), function(i) {
            return currentValue.substr( separatorIndex[i], ( (separatorIndex[i+1]-separatorIndex[i])-1) ) + config.separator;
          }).join('');
          currentValue = currentValue.substr( (separatorIndex[sepIdxLen-2]-1) );
        }
      }
    }
    if ( currentValue.length > (separatorIndex[sepIdxLen-1] - (sepIdxLen-1)) ) {
      newValue += currentValue.substr(0, separatorIndex[0]) + config.separator;
      newValue += _.times((sepIdxLen-1), function(i) {
        return currentValue.substr( (separatorIndex[i]-i ), ((separatorIndex[1+i]-separatorIndex[i])-1) ) + config.separator;
      }).join('');
      currentValue = currentValue.substr(separatorIndex[sepIdxLen-1]-(sepIdxLen-1));
    }
    newValue += currentValue;
    return newValue;
  },

  handleMaskChange: function(payload, pasted) {
    var actionName = constants.actions.FIELD_VALUE_CHANGE;
    var outputValue = '';
    var outputUnmasked = '';
    // handle backspacing
    var isBackspace = (this.state.keyPressed === constants.keyCodes.BACKSPACE);
    // remove any char if not a number or asterisk
    var config = this.state.maskConfig;
    // get mask symbol & symbol separator
    var symb = this.getRegEx(config.symbol, config.allowedStringType);
    var sep = this.getRegEx(config.separator);
    var validChar = symb.test(payload.value.slice(-1));
    if (validChar) {
      // filter out separators
      var filtered = payload.value.replace(sep, '');
      var newUnmasked = filtered.slice(-1);
      // mask filtered chars
      var currentValue = filtered.slice(0, -1) + config.symbol;
      // don't mask after last maskIndex
      if ( currentValue.length > this.state.maskConfig.maskIndex.length ) {
        currentValue = filtered;
      }
      outputValue = pasted ? this.setMask(pasted, true) : this.setMask(currentValue);
      outputUnmasked = isBackspace ? this.state.unmasked.slice(0, -1) : this.state.unmasked + newUnmasked;
    } else {
      outputValue = payload.value.slice(0, -1);
      outputUnmasked = isBackspace ? this.state.unmasked.slice(0, -1) : this.state.unmasked;
    }
    this.setState({value: outputValue, unmasked: outputUnmasked});
    Flux.doAction(actionName, _.merge(payload, {value: outputValue, unmasked: outputUnmasked}));
  }
};
