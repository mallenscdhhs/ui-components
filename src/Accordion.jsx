'use-strict';
import React from 'react';
import {Accordion as RBAccordion} from 'react-bootstrap';
import renderChildren from './render-children';

/**
 * Returns a Bootstrap Accordion (panel-group supporting collapsible panels)
 * @param {number} defaultActiveKey - Optionally pass in the index of a panel
 * that should be open on render
 * @module Accordion
 */
class Accordion extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    let eventKey = e.component.eventKey;
    e.component = {
      id: this.props.id,
      schemaUpdates: {
        defaultActiveKey: eventKey
      }
    };
  }

  render() {
    return (
      <RBAccordion
        id={this.props.id}
        defaultActiveKey={this.props.defaultActiveKey}
        className="accordion"
        onClick={this.handleClick}>
          {renderChildren(this.props)}
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
