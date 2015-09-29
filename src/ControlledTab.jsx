'use-strict';
import React from 'react';
import {Tab, Panel} from 'react-bootstrap';
import renderChildren from './render-children';

class ControlledTab extends React.Component {

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

export default ControlledTab;
