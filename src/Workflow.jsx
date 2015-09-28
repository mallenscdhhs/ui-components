'use-strict';
import React from 'react';
import Tree from './Tree';
import WorkflowItem from './WorkflowItem';
import renderChildren from './render-children';

/**
 * Manages the flow of a user through a set of defined screens.
 * @class Workflow
 */
class Workflow extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <div>
        <h4>{this.props.title}</h4>
        <Tree ref="outline">
          {renderChildren(this.props)}
        </Tree>
      </div>
    );
  }
}

Workflow.propTypes = {
  title: React.PropTypes.string
};

Workflow.defaultProps = {
  componentType: 'workflow'
};

export default Workflow;
