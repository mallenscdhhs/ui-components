'use-strict';
import React from 'react';
import {TabPane, Panel} from 'react-bootstrap';
import {dispatcher as Dispatcher} from 'fluxify';
import constants from '../../common/constants';

let {TAB_RERENDER} = constants.actions;

/**
 * Wraps the react-bootstrap TabPane component with some custom markup, and
 * facilitates re-rendering of the tab by a parent component.
 * @class WrappedTabPane
 */
class WrappedTabPane extends React.Component {

  constructor() {
    super();
    this.state = {children: []};
  }

  componentWillMount() {
    this.setState({
      children: this.props.children,
      rerenderAction: `tabpane-rerender-${this.props.eventKey}`
    });
  }

  componentDidMount() {
    // when this tab's state has changed and needs to be re-rendered
    Dispatcher.register(this.state.rerenderAction, (action, data) => {
      if (action === TAB_RERENDER && data.eventKey === this.props.eventKey) {
        this.setState({children: data.children});
      }
    });
  }

  componentWillUnMount() {
    Dispatcher.unregister(this.state.rerenderAction);
  }

  render() {
    return (
      <TabPane {...this.props}>
        <Panel>{this.state.children}</Panel>
      </TabPane>
    )
  }
}

export default WrappedTabPane;
