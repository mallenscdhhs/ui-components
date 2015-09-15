'use-strict';
import React from 'react';
import {Panel} from 'react-bootstrap';
import renderChildren from './render-children';

/**
 * Returns a Bootstrap Accordion Panel (panel in a collapsible panel-group)
 * @module AccordionPanel
 */
class AccordionPanel extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.component = this.props;
  }

  render() {
    return (
      <Panel
        {...this.props}
        onClick={this.handleClick}
        bsStyle={this.props.expanded ? 'info' : 'default'}>
          {renderChildren(this.props)}
      </Panel>
    );
  }
}

export default AccordionPanel;
