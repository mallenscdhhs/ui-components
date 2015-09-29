'use-strict';
import React from 'react';
import {Tab, Panel} from 'react-bootstrap';
import renderChildren from './render-children';

class ControlledTab extends React.Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    console.log(e);
  }

  render() {
    return (
      <Tab {...this.props} onClick={this.handleClick}>
        <Panel>{renderChildren(this.props)}</Panel>
      </Tab>
    )
  }
}

export default ControlledTab;
