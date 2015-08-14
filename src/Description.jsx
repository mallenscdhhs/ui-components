'use-strict';
import React from 'react';
import setClassNames from 'classnames';
import {Popover, OverlayTrigger} from 'react-bootstrap';

/**
 * Create Description popup for a field
 * @module Description
 */
class Description extends React.Component {

  getPopover() {
    return <Popover title={this.props.descriptionTitle}>{this.props.description}</Popover>;
  }

  getClassNames() {
    return setClassNames({
      glyphicon: true,
      'glyphicon-info-sign': true
    });
  }

  render() {
    return (
      <span className="field-description">
        <OverlayTrigger
          trigger={this.descriptionTrigger}
          placement={this.descriptionPlacement}
          overlay={this.getPopover()}>
            <span className={this.getClassNames()} aria-hidden="true"></span>
        </OverlayTrigger>
      </span>
    );
  }
}

Description.propTypes = {
  description: React.PropTypes.string.isRequired,
  descriptionTrigger: React.PropTypes.string,
  descriptionPlacement: React.PropTypes.string
};

Description.defaultProps = {
  desriptionTrigger: ['hover', 'focus'],
  descriptionPlacement: 'top'
};

export default Description;
