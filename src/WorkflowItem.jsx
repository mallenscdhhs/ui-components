'use-strict';
import React from 'react';
import classnames from 'classnames';
import Tree from './Tree';
import renderChildren from './render-children';
import Immutable from 'immutable';

/**
 * Used to represent a page in a Workflow
 * @module WorkflowItem
 */
class WorkflowItem extends React.Component {

  constructor(props){
    super(props);
  }

  handleClick(e){
    e.component = {
      id: this.props.id
    }
  }

  render(){
    let iClassNames = classnames({
      'inactive': !this.props.active,
      'current' : this.props.current,
      'disabled': this.props.disabled
    });
    return (
      <li className={iClassNames} role="presentation">
        <a href="javascript:void(0)" data-disabled={this.props.disabled} onClick={this.handleClick.bind(this)}>{this.props.title}</a>
        <Tree>{renderChildren(this.props)}</Tree>
      </li>
    );
  }

};

WorkflowItem.defaultProps = {
  active: true,
  disabled: false,
  current : false,
  skip: false
};

WorkflowItem.propTypes = {
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  active: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  current: React.PropTypes.bool,
  skip: React.PropTypes.bool
};

export default WorkflowItem;
