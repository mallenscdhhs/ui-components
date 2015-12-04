'use-strict';
import React from 'react';
import {Button, Glyphicon} from 'react-bootstrap';

/**
 * @class Action
 */
class Action extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  /**
  * Returns a span element with icon classes
  * @return {Object}
  */
  renderIcon() {
    if (this.props.iconClass) {
      return <Glyphicon glyph={this.props.iconClass} aria-hidden="true"/>;
    }
  }

  /**
   * Event handler for onClick, that pushes a message to the queue, with the action is clicked.
   * It's used with workflow to update page based on the action clicked.
   * @returns {void}
   */
  handleClick(e) {
    if (!this.props.disabled) {
      e.component = this.props;
    } else {
      e.stopPropagation();
    }
  }

  /**
   * Render a Action component.
   * @returns {JSX}
   */
  render() {
    return (
      <div className={`pull-${this.props.align}`}>
        <Button
          disabled={!!this.props.disabled}
          bsStyle={this.props.styleName}
          bsSize={this.props.size}
          onClick={this.handleClick}>
          {this.renderIcon()}
          {this.props.label}
        </Button>
      </div>
    );
  }

}

Action.propTypes = {
  id: React.PropTypes.string.isRequired,
  type: React.PropTypes.oneOf(['button', 'link']),
  label: React.PropTypes.string,
  name: React.PropTypes.string,
  formId: React.PropTypes.string,
  styleName: React.PropTypes.string,
  size: React.PropTypes.string,
  align: React.PropTypes.oneOf(['left', 'right']),
  iconClass: React.PropTypes.string,
  disabled: React.PropTypes.bool
};

Action.defaultProps = {
  componentType: 'action',
  type: 'button',
  styleName: 'default',
  align: 'left'
};

export default Action;
