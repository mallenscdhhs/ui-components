'use-strict';
import React from 'react';
import {Tabs} from 'react-bootstrap';
import {elements} from '@scdhhs/ui-components';
import Immutable from 'immutable';
import renderChildren from './render-children';

class Tabs extends React.Component {

  static defaultProps = {
    activeKey: 0,
    lastSectionCompleted: -1
  };

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

export default Tabs;
