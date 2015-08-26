/* jshint node:true */

import React from 'react';
import {Accordion as RBAccordion} from 'react-bootstrap';
import Immutable from 'immutable';

/**
 * Returns a Bootstrap Accordion (panel-group supporting collapsible panels)
 * @param {number} defaultActiveKey - Optionally pass in the index of a panel
 * that should be open on render
 * @module Accordion
 */
class Accordion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      defaultActiveKey: 0
    };
    this.handleSelection = this.handleSelection.bind(this);
    this.getActiveStyle = this.getActiveStyle.bind(this);
  }

  componentWillMount() {
    if (this.props.defaultActiveKey) {
      this.setState({defaultActiveKey: this.props.defaultActiveKey});
    }
  }

  handleSelection(eventKey) {
    this.setState({defaultActiveKey: eventKey});
  }

  getActiveStyle(idx, defaultActiveKey) {
    return (idx === defaultActiveKey) ? 'info' : 'default';
  }

  render() {
    console.log('state', this.state);
    return (
      <RBAccordion
        id={this.props.id}
        defaultActiveKey={this.props.defaultActiveKey}
        onSelect={this.handleSelection} >
          {React.Children.map(this.props.children, (child, idx) => {
            let props = Immutable.Map(child.props);
            let cloneProps = props
              .set('eventKey', idx)
              .set('bsStyle', this.getActiveStyle(idx, this.state.defaultActiveKey)).toJSON();
            return React.cloneElement(child, cloneProps, child.props.children);
          })}
      </RBAccordion>
    );
  }
}

Accordion.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  defaultActiveKey: React.PropTypes.number
};

Accordion.defaultProps = {
  id: '',
  name: '',
  defaultActiveKey: 0
};

export default Accordion;
