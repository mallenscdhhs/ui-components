'use-strict';
import React from 'react';
import {dispatcher as Dispatcher} from 'fluxify';
import {TabbedArea} from 'react-bootstrap';
import {elements} from '@scdhhs/ui-components';
import Immutable from 'immutable';
import constants from '../../common/constants';

let Action = elements.action;

let {
  PAGE_FORM_NEXT_SECTION_VALIDATED,
  TAB_UPDATE_CHILDREN,
  TAB_RERENDER
} = constants.actions;

/**
 * Creates a sub workflow using react-bootstrap's TabArea component, and manages
 * the flow through the tabs.
 * @module ControlledTab
 */
class ControlledTab extends React.Component {

  static defaultProps = {
    tabKey: 0,
    lastSectionCompleted: 0
  };

  constructor() {
    super();
    this.actions = [];
    this.state = {};
    this.nextSection = this.nextSection.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    this.setState({
      tabKey: this.props.tabKey,
      lastSectionCompleted: this.props.tabKey
    });
  }

  componentDidMount() {
    this.actions.push(
      Dispatcher.register((action, data) => {
        // Form validated, move to next section
        if (action === PAGE_FORM_NEXT_SECTION_VALIDATED) {
          this.nextSection();
        }
      }),
      Dispatcher.register((action, data) => {
        // the state of an individual tab has changed, re-render that tab
        if (action === TAB_UPDATE_CHILDREN) {
          data.eventKey = this.state.tabKey;
          Dispatcher.dispatch(TAB_RERENDER, data);
        }
      })
    );
  }

  componentWillUnmount() {
    this.actions.forEach(action => Dispatcher.unregister(action));
  }

  /**
   * Move to next tab and keep track of where we are.
   */
  nextSection(){
    let currentTabKey = Number(this.state.tabKey);
    let nextTabKey = currentTabKey + 1;
    if (this.props.children.length > nextTabKey) {
      this.setState({lastSectionCompleted: nextTabKey});
      this.handleSelect(nextTabKey);
    }
  }

  /**
   * Go to selected tab.
   * @param {number} tabKey - the eventKey of the tab to transition to
   */
  handleSelect(tabKey) {
    this.setState({tabKey});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.tabKey !== this.state.tabKey;
  }

  render() {
    return (
      <TabbedArea
        activeKey={this.state.tabKey}
        animation={false}
        onSelect={this.handleSelect}
        key='controlledTabbedArea'>
          {React.Children.map(this.props.children, (child) => {
            let props = Immutable.Map(child.props);
            let isDisabled = child.props.eventKey > this.state.lastSectionCompleted;
            let cloneProps = props.set('disabled', isDisabled).toJSON();
            return React.cloneElement(child, cloneProps, child.props.children);
          })}
      </TabbedArea>
    );
  }
};

export default ControlledTab;
