'use-strict';
import React from 'react';
import { dispatcher as Dispatcher } from 'fluxify';
import constants from './constants';
import _ from 'lodash';

let {
  LOAD_OPTIONS,
  SEND_RESOURCE_OPTIONS,
  SEND_OPTIONS,
  FIELD_VALUE_CHANGE,
  ENTRYLIST_FIELD_VALUE_CHANGE
} = constants.actions;

let valueChangeActions = [ENTRYLIST_FIELD_VALUE_CHANGE, FIELD_VALUE_CHANGE];

/**
 * Manages the accumulated dependent field values for build the filter param.
 * @class DependencyStore
 */
class DependencyStore {
  constructor(){
    this.values = {};
  }
  get(name){
    return this.values[name];
  }
  getAll(){
    return this.values;
  }
  set(name, value){
    this.values[name] = value;
  }
}

/**
 * Manages component options
 * @module OptionsMixins
 * @type {{propTypes: {options: (isRequired|*)}, componentDidMount: Function, componentWillUnmount: Function}}
 */
export default {

  propTypes: {
    options: React.PropTypes.arrayOf(React.PropTypes.object),
    optionsResource: React.PropTypes.string,
    optionsDependencyName: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  /**
   * Load in the options state either from config props or
   * ask the parent app to load them from the server.
   * @fires SEND_RESOURCE_OPTIONS
   */
  componentDidMount() {
    let dependencyStore = new DependencyStore();
    // if a client is sending us new options...
    Dispatcher.register(`${this.props.id}-LOAD-OPTIONS`, (action, data) => {
      if (action === LOAD_OPTIONS && data.id === this.props.id) {
        this.setState({options: data.options});
      }
    });

    if (this.props.optionsDependencyName) {
      this.props.optionsDependencyName.forEach((name) => {
        Dispatcher.register(`${name}-${this.props.id}-handler`, (action, data) => {
          if (_.includes(valueChangeActions, action) && data.name === name) {
            dependencyStore.set(data.name, data.value);
            let dependencyFilter = JSON.stringify(dependencyStore.getAll());
            this.initOptions(_.extend({dependencyFilter}, this.props));
          }
        });
      });
    }

    this.initOptions(this.props);
  },

  componentWillUnmount() {
    Dispatcher.unregister(`${this.props.id}-LOAD-OPTIONS`);
    if (this.props.optionsDependencyName) {
      this.props.optionsDependencyName.forEach((name) => {
        Dispatcher.unregister(`${name}-${this.props.id}-handler`);
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEqual(nextProps, this.props) ) {
      this.initOptions(nextProps);
    }
  },

  /**
   * Load in options from passed in props, an API, or from a parent application.
   * @param {object} props - this components properties
   * @fires SEND_OPTIONS, SEND_RESOURCE_OPTIONS
   */
  initOptions(props) {
    if (props.options) {
      this.setState({options: props.options});
    } else if (props.optionsResource) {
      Dispatcher.dispatch(SEND_RESOURCE_OPTIONS, {
        resourceFilter: props.dependencyFilter,
        resourceName: props.optionsResource,
        fieldId: props.id,
        fieldName: props.name
      });
    } else {
      Dispatcher.dispatch(SEND_OPTIONS, props);
    }
  }
};
