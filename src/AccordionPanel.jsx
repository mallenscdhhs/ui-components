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
    this.getCollapseState = this.getCollapseState.bind(this);
  }

  handleClick(e) {
    e.component = this.props;
  }

  getCollapseState() {
    return (
      <h3>
        {this.props.header}
        <span>
          {this.props.expanded ? (
            <span className="pull-right">Hide <i className="glyphicon glyphicon-triangle-top"></i></span>
          ) : (
            <span className="pull-right">Show <i className="glyphicon glyphicon-triangle-bottom"></i></span>
          )}
        </span>
      </h3>
    );
  }

  render() {
    return (
      <Panel
        {...this.props}
        className="accordion-panel"
        onClick={this.handleClick}
        header={this.getCollapseState()}>
          {renderChildren(this.props)}
      </Panel>
    );
  }
}

export default AccordionPanel;
