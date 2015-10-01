'use-strict';
import React from 'react';
import Immutable from 'immutable';
import {Input} from 'react-bootstrap';
import FieldLabel from './FieldLabel';
import _ from 'lodash';
import classNames from 'classnames';

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
        value = _.filter(this.props.value, v => v !== value);
      } else {
        let current = this.props.value || [];
        value = current.concat([value]);
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

  renderHelpBlock(message) {
    if (message) {
      return <p className="help-block">{message}</p>;
    }
  }

  render() {
    let styles = classNames({
      'has-error': this.props.hasError,
      'form-group': true
    });

    return (
      <fieldset className={styles} onChange={this.handleChange} onBlur={this.props.onBlur}>
        <legend>
          {this.props.label}
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
          {this.renderHelpBlock(this.props.help)}
        </div>
      </fieldset>
    );
  }
}

FieldGroup.propTypes = {
  id: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  required: React.PropTypes.bool,
  helpText: React.PropTypes.string,
  visible: React.PropTypes.bool,
  disabled: React.PropTypes.bool
};

FieldGroup.defaultProps = {
  initialState: 'visible',
  disabled: false,
  visible: true,
  hasError: false
};

export default FieldGroup;
