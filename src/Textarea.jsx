'use-strict';
import React from 'react';
import _ from 'lodash';
import ValueChangeMixin from './ValueChangeMixin';

/**
 * Renders a <textarea> input control.
 * @module Textarea
 */
export default React.createClass({

  displayName: 'Textarea',

  mixins: [ValueChangeMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    rows: React.PropTypes.string,
    cols: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    inputProps: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getDefaultProps() {
    return {
      value: '',
      inputProps: ['id', 'name', 'value', 'cols', 'rows', 'maxLength', 'className', 'aria-describedby']
    };
  },

  componentWillMount() {
    this.setState({value: this.props.value});
  },

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value});
  },

  render() {
    let props = _.pick(this.props, this.props.inputProps);
    return (
      <textarea
        value={this.state.value}
        onChange={this.onChange}
        onBlur={this.onBlur}
        {...props} />
    );
  }

});
