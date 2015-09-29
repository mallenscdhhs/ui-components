'use-strict';
import React from 'react';
import {Tab, Panel} from 'react-bootstrap';
import renderChildren from './render-children';

/**
 * Wraps the react-bootstrap TabPane component with some custom markup, and
 * facilitates re-rendering of the tab by a parent component.
 * @class WrappedTabPane
 */
class Tab extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <Tab {...this.props}>
        <Panel>{renderChildren(this.props)}</Panel>
      </Tab>
    )
  }
}

export default Tab;
