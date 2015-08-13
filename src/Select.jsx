'use-strict';
import React from 'react';
import OptionsMixin from './OptionsMixin';
import _ from 'lodash';
import update from 'react/lib/update';
import ValueChangeMixin from './ValueChangeMixin';

/**
 * Renders a <select> and manages its state.
 * @module Select
 */
export default React.createClass({

  displayName: 'Select',

  mixins: [OptionsMixin, ValueChangeMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    multiple: React.PropTypes.bool,
    inputProps: React.PropTypes.arrayOf(React.PropTypes.string),
    defaultOption: React.PropTypes.shape({
      value: React.PropTypes.string,
      label: React.PropTypes.string
    }),
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ])
  },

  getDefaultProps() {
    return {
      inputProps: ['id', 'name', 'multiple', 'className', 'aria-describedby', 'disabled'],
      defaultOption: {
        value: '',
        label: 'select...'
      }
    };
  },

  componentWillMount() {
    let value = this.props.value || (this.props.multiple ? [] : '');
    let options = [];
    this.setState({options, value});
  },

  componentWillReceiveProps(nextProps) {
    let options = nextProps.options;
    let value = nextProps.value;
    this.setState({options, value});
  },

  /**
   * Return default 'option' if not a multiselect, so dropdowns will not have 'default' selected options
   * @return {jsx}
   */
  getEmptyOption() {
    var defaultOption;
    if (this.props.multiple !== true) {
      defaultOption = <option value={this.props.defaultOption.value} key={"option-default-option"}>{this.props.defaultOption.label}</option>;
    }
    return defaultOption;
  },

  handleSelection(event) {
    let opts;
    let e = {target: {value: event.target.value}};
    if (this.props.multiple === true) {
      opts = _.toArray(event.target.options);
      e.target.value = _.map(_.filter(opts, option => option.selected), option => option.value);
    }
    this.onChange(e);
  },

  render() {
    let props = _.pick(this.props, this.props.inputProps);
    return (
      <select
        value={this.state.value}
        onChange={this.handleSelection}
        onBlur={this.onBlur}
        {...props}>
        {this.getEmptyOption()}
        {_.map(this.state.options, opt => <option value={opt.value} key={"option-"+opt.value}>{opt.label}</option>)}
      </select>
    );
  }
});
