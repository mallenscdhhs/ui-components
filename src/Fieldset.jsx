'use-strict';
import React from 'react';
import Description from './Description';
import classnames from 'classnames';
import renderChildren from './render-children';

/**
 * Fieldset component
 * @module Fieldset
 */
class Fieldset extends React.Component {

  constructor(props) {
    super(props);
  }

  getHelpText(){
    let helpText;
    if(this.props.helpText){
      helpText = <p key="help-block">{this.props.helpText}</p>;
    }
    return helpText;
  }

  getDescription(){
    let description;
    if(this.props.description){
      description = <Description key="description-text" {...this.props} />;
    }
    return description;
  }

  getLabel(){
    let fieldSetLabel = null;
    if(this.props.name){
      fieldSetLabel = <legend className="field-label" key={this.props.name+"Legend"}>{this.props.legend}{this.getDescription()}</legend>;
    }
    return fieldSetLabel;
  }

  getClassNames(){
    return classnames({
      hidden: !this.props.visible
    });
  }

  /**
   * Render a Fieldset component.
   * @returns {JSX}
   */
  render(){
    return (
      <fieldset key="fieldSetWithComponentsKey" id={this.props.id} className={this.getClassNames()}>
        {this.getLabel()}
        {this.getHelpText()}
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