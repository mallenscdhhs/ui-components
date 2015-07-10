'use-strict';
import React from 'react';
import Immutable from 'immutable';
import Checkable from './Checkable';
import { dispatcher as Dispatcher } from 'fluxify';
import constants from './constants';
import OptionsMixin from './OptionsMixin';
import _ from 'lodash';
import ValueChangeMixin from './ValueChangeMixin';

let {
  FIELD_VALUE_CHANGE,
  FIELD_GROUP_VALUE_CHANGE
} = constants.actions;

/**
 * Determines if the passed-in value matches the value of
 * the FieldGroup(can be an Array or String).
 * @param {object} props
 * @param {string} value
 * @returns {boolean}
 */
let isOptionChecked = function(props, value) {
  if ( _.isArray(props.value) ) {
    return _.contains(props.value, value);
  } else {
    return value === props.value;
  }
};

/**
 * Represents a group of Checkable instances. Will manage value changes and blurs.
 * @class FieldGroup
 */
export default React.createClass({

  displayName: 'FieldGroup',

  mixins: [OptionsMixin, ValueChangeMixin],

  statics: {
    isOptionChecked
  },

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    required: React.PropTypes.bool,
    persistInSession: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      fieldValueChangeAction: FIELD_VALUE_CHANGE
    };
  },

  componentWillMount() {
    let value = this.props.value || (this.props.type === 'checkbox' ? [] : '');
    this.setState({value});
  },

  componentDidMount() {
    Dispatcher.register(`${this.props.id}-FIELD-GROUP-CHANGE`, (action, data) => {
      if(action === FIELD_GROUP_VALUE_CHANGE &&
        data.name === this.props.name &&
        data.id.lastIndexOf(this.props.id) >= 0) {

        let value = data.value;
        if (this.props.type === 'checkbox') {
          if (data.value === null) {
            value = _.filter(this.state.value, {name: data.name});
          } else {
            value = this.state.value.concat([data.value]);
          }
        }

        this.setState({value});

        // added individualValue to represent the latest individual value changed in a field-group
        Dispatcher.dispatch(
          this.props.fieldValueChangeAction,
          _.merge({individualValue: data.value, value}, this.props)
        );
      }
    });
  },

  componentWillUnmount() {
    Dispatcher.unregister(`${this.props.id}-FIELD-GROUP-CHANGE`);
  },

  render() {
    return (
      <div className="field-group" onBlur={this.onBlur}>
        {_.map(this.state.options, option => {
          let id = `${this.props.id}-option-${option.value}`;
          let config = Immutable.fromJS(option).withMutations(data => {
            data
              .set('id', id)
              .set('name', this.props.name)
              .set('type', this.props.type)
              .set('checked', isOptionChecked(this.state, option.value))
              .set('isFieldGroup', true)
              .set('key', id);
          }).toJSON();

          return <Checkable {...config}/>;
        })}
      </div>
    );
  }

});
