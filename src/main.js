'use-strict';
import elements from './index';
import Factory from './Factory';
import _ from 'lodash';
import constants from './constants';


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
   * DEPRECATED, use Factory.build instead.
   */
  factory: function(schema){
    return Factory.build(elements, schema, schema)[0];
  }
};
