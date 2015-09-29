'use-strict';
import React from 'react';
import {Tabs} from 'react-bootstrap';
import renderChildren from './render-children';

class ControlledTabs extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <Tabs
        activeKey={this.props.activeKey}
        animation={false}
        key='controlledTabbedArea'>
        {renderChildren(this.props)}
      </Tabs>
    );
  }
};

export default ControlledTabs;
