'use-strict';
import React from 'react';
import setClassNames from 'classnames';
import Field from './Field';
import Content from './Content';

class Terms extends React.Component {
  constructor() {
    super();
    this.state = {
      termsRead: false
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.renderLegend = this.renderLegend.bind(this);
    this.renderCheckboxHeader = this.renderCheckboxHeader.bind(this);
  }

  componentDidMount() {
    //Add Scroll listener to the DOM
    this.refs.terms.getDOMNode().addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.refs.terms.getDOMNode().removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event, scrollTop, offsetHeight, scrollHeight) {
    // handleScroll args are passed in mainly for testing, these will never be used in practice
    let $terms = this.refs.terms.getDOMNode();
    scrollTop = scrollTop || $terms.scrollTop;
    offsetHeight = offsetHeight || $terms.offsetHeight;
    scrollHeight = scrollHeight || $terms.scrollHeight;

    // enable Agree checkbox upon scrolling to the bottom of the terms textarea
    if (scrollTop >= scrollHeight - offsetHeight) {
      this.setState({
        termsRead: true
      });
    }
  }

  getClassNames() {
    return setClassNames(
      'form-control',
      'terms-and-conditions',
      this.props.className
    );
  }

  renderLegend() {
    return this.props.legend ? <legend>{this.props.legend}</legend> : null;
  }

  renderCheckboxHeader() {
    return this.props.checkboxHeader ? (
      <Content
        id={`${this.props.id}-checkbox-header`}
        name={`${this.props.id}-checkbox-header`}
        content={this.props.checkboxHeader} />
    ) : (
      null
    );
  }

  render() {
    return (
      <fieldset className="form-group">
        {this.renderLegend()}
        <textarea
          id={this.props.id}
          ref="terms"
          readOnly
          className={this.getClassNames()}
          value={this.props.value} />
        {this.renderCheckboxHeader()}
        <Field
          id={`agree-to-${this.props.id}`}
          name={`agree-to-${this.props.id}`}
          type="checkbox"
          disabled={!this.state.termsRead}
          label={this.props.checkboxLabel}
          required={this.props.required}
          value="attested" />
      </fieldset>
    );
  }
}

Terms.propTypes = {
  id: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  legend: React.PropTypes.string,
  checkboxHeader: React.PropTypes.string,
  checkboxLabel: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  required: React.PropTypes.bool,
  rules: React.PropTypes.object
};

Terms.defaultProps = {
  id: '',
  value: '',
  legend: '',
  checkboxHeader: '',
  checkboxLabel: '',
  className: '',
  required: true,
  rules: {}
};

export default Terms;
