'use-strict';
import React from 'react';
import {Tabs} from 'react-bootstrap';
import renderChildren from './render-children';

class ControlledTabs extends React.Component {

  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSelect(key) {
    let _div = React.findDOMNode(this);
    let event = new Event('change', {});
    event.component = {
      id: this.props.id,
      schemaUpdates: {
        id: this.props.id,
        activeKey: key
      }
    };
    _div.dispatchEvent(event);
    console.log('handleSelect',key,event);
  }

  handleChange(e){
    console.log('changeEvent',e);
  }

  componentDidMount() {
    let _div = React.findDOMNode(this);
    _div.addEventListener('change', this.handleChange);
  }

  render() {
    return (
      <Tabs
        activeKey={this.props.activeKey}
        animation={false}
        onSelect={this.handleSelect}
        key='controlledTabbedArea'>
        {renderChildren(this.props)}
      </Tabs>
    );
  }
};

export default ControlledTabs;
