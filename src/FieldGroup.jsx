'use-strict';
import React from 'react';
import Immutable from 'immutable';
import {Input} from 'react-bootstrap';
import FieldLabel from './FieldLabel';
import _ from 'lodash';

/**
 * Represents a group of Checkable instances. Will manage value changes and blurs.
 * @class FieldGroup
 */
class FieldGroup extends React.Component {
  /**
   * Determines if the passed-in value matches the value of
   * the FieldGroup(can be an Array or String).
   * @param {object} props
   * @param {string} value
   * @returns {boolean}
   */
  static isOptionChecked(props, value) {
    if (_.isArray(props.value)) {
      return _.contains(props.value, value);
    } else {
      return value === props.value;
    }
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    let value = e.target.value;
    let schemaUpdates = {};

    if (this.props.type === 'checkbox') {
      if (!e.target.checked) {
        value = _.filter(this.props.value, {name: e.target.name});
      } else {
        value = this.props.value.concat([value]);
      }
    } else {
      value = e.target.checked? value : null;
      schemaUpdates.checked = e.target.checked;
    }

    e.component = {
      id: this.props.id,
      schemaUpdates,
      modelUpdates: {
        id: this.props.name,
        value
      }
    };
  }

  render() {
    return (
      <fieldset onChange={this.handleChange} onBlur={this.props.onBlur}>
        <legend>
          <FieldLabel {...this.props}/>
        </legend>
        <div className="field-group">
          {_.map(this.props.options, (option) => {
            let id = `${this.props.id}-option-${option.value}`;
            let config = Immutable.fromJS(option).withMutations(data => {
              data
                .set('id', id)
                .set('name', this.props.name)
                .set('type', this.props.type)
                .set('checked', FieldGroup.isOptionChecked(this.props, option.value))
                .set('isFieldGroup', true)
                .set('key', id)
                .set('inline', this.props.inline);
            }).toJSON();

            return <Input {...config}/>;
          })}
        </div>
      </fieldset>
    );
  }
}

FieldGroup.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  value: React.PropTypes.any,
  required: React.PropTypes.bool,
  persistInSession: React.PropTypes.bool
};

export default FieldGroup;
