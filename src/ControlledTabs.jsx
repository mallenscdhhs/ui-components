'use-strict';
import React from 'react';
import {Tabs} from 'react-bootstrap';
import renderChildren from './render-children';

class ControlledTabs extends React.Component {

  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(key) {
    let _div = React.findDOMNode(this);
    let event = new Event('change', {bubbles: true, cancelable: true});
    event.component = {
      id: this.props.id,
      schemaUpdates: {
        components: {
          [this.props.id]: {
            config: {
              activeKey: key
            }
          }
        }
      }
    };
    _div.dispatchEvent(event);
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
