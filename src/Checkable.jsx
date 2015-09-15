'use-strict';
import React from 'react';
import FieldLabel from './FieldLabel';
import _ from 'lodash';

/**
 * Renders either a radio|checkbox input control.
 * @module Checkable
 */
class Checkable extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(e) {
    let value = e.target.checked? this.props.value : null;
    e.component = {
      id: this.props.id,
      schemaUpdates: {
        checked: e.target.checked
      },
      modelUpdates: {
        id: this.props.name,
        value
      }
    };
  }

  handleBlur(e) {
    e.component = this.props;
  }

  render() {
    let props = _.pick(this.props, this.props.inputProps);
    let labelProps = _.pick(this.props, this.props.labelProps);
    let className = this.props.type;
    if (this.props.inline) {
      className += '-inline';
    }
    props.checked = !!props.checked;
    return (
      <div className={className}>
        <FieldLabel {...labelProps}>
          <input
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            {...props} />
        </FieldLabel>
      </div>
    );
  }
}

Checkable.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool
  ]).isRequired,
  disabled: React.PropTypes.bool,
  isFieldGroup: React.PropTypes.bool,
  inline: React.PropTypes.bool,
  checked: React.PropTypes.bool,
  helpText: React.PropTypes.string,
  required: React.PropTypes.bool
};

Checkable.defaultProps = {
  componentType: 'field',
  inline: true,
  inputProps: ['type', 'id', 'name', 'value', 'disabled', 'checked', 'aria-describedby'],
  labelProps: ['label', 'id', 'required']
};

export default Checkable;
