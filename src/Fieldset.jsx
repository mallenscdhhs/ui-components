'use-strict';
import React from 'react';
import FieldLabel from './FieldLabel';
import classnames from 'classnames';
import renderChildren from './render-children';
import _ from 'lodash';

/**
 * Fieldset component
 * @module Fieldset
 */
class Fieldset extends React.Component {

  constructor(props) {
    super(props);
  }

  renderHelpText() {
    if (this.props.helpText) {
      return <p key="help-block">{this.props.helpText}</p>;
    }
  }

  renderLabel() {
    if (this.props.legend) {
      // FieldLabel uses this.props.children which will duplicate
      // any children of the Fieldset if not omitted
      let props = _.omit(this.props, 'children');
      return (
        <legend className="field-label" key={`${this.props.id}-legend`}>
          <FieldLabel {...props} label={this.props.legend}/>
        </legend>
      );
    }
  }

  getClassNames() {
    return classnames({
      hidden: !this.props.visible
    });
  }

  /**
   * Render a Fieldset component.
   * @returns {JSX}
   */
  render() {
    return (
      <fieldset key="fieldSetWithComponentsKey" id={this.props.id} className={this.getClassNames()}>
        {this.renderLabel()}
        {this.renderHelpText()}
        {renderChildren(this.props)}
      </fieldset>
    );
  }

};

Fieldset.propTypes = {
  title: React.PropTypes.string
};

Fieldset.defaultProps = {
  componentType: 'fieldset'
};

export default Fieldset;
