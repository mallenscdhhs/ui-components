'use-strict';
import React from 'react';
import setClassNames from 'classnames';
import Field from './Field';

class Terms extends React.Component {
  constructor() {
    super();
    this.state = {
      termsRead: false
    };
    this.handleScroll = this.handleScroll.bind(this);
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
      this.props.className
    );
  }

  render() {
    return (
      <div>
        <textarea
          id={this.props.id}
          ref="terms"
          readOnly
          className={this.getClassNames()}
          value={this.props.value} />
        <Field
          id={`agree-to-${this.props.id}`}
          name={`agree-to-${this.props.id}`}
          type="checkbox"
          disabled={!this.state.termsRead}
          label={this.props.fieldLabel}
          required={this.props.required}
          value={false} />
      </div>
    );
  }
}

Terms.propTypes = {
  id: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  fieldLabel: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  required: React.PropTypes.bool,
  rules: React.PropTypes.object
};

Terms.defaultProps = {
  id: '',
  value: '',
  fieldLabel: '',
  className: 'mbmd',
  required: true,
  rules: {}
};

export default Terms;
