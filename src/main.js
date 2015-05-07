'use-strict';
import elements from './index';
import Factory from './Factory';
import _ from 'lodash';
import constants from './constants';
import configuration from './configuration';
import ValidationStore from './ValidationStore';
import OptionsStore from './OptionsStore';


/**
 * This is the main API for the component library. You can use
 * any of the elements in a JSX environment, or you can generate
 * an entire ReactElement DOM by calling Components#factory.
 * @module Components
 */
export default {
  /**
   * @type {object}
   */
  elements: elements,
  /**
   * @type {object}
   */
  constants: constants,
  /**
   * Pass-in any configuration needed to setup the Components library.
   * @param {object} data
   */
  configure: _.bind(_.merge, null, configuration),
  /**
   * DEPRECATED, use Factory.build instead.
   */
  factory: function(schema){
    console.warn('DEPRECATED: please use the static Factory method "build" instead.');
    return Factory.build(elements, schema, schema)[0];
  }
};
