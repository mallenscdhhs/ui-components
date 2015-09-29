'use-strict';
import React from 'react';
import {Tab, Panel} from 'react-bootstrap';
import renderChildren from './render-children';

class ControlledTab extends React.Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleSelect(key) {
    let _div = React.findDOMNode(this);
    let event = new Event('change', {});
    _div.dispatchEvent(event);
    console.log('handleSelect',key,event);
  }

  handleChange(e){
    e.component = this;
    console.log('changeEvent',e);
  }

  componentDidMount() {
    let _div = React.findDOMNode(this);
    _div.addEventListener('change', this.handleChange);
  }

  render() {
    return (
      <Tab {...this.props} onSelect={this.handleSelect}>
        <Panel>{renderChildren(this.props)}</Panel>
      </Tab>
    )
  }
}

export default ControlledTab;
