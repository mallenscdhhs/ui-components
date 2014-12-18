'use-strict';
var React = require('react/addons');
var EditorMixin = require('./EditorMixin');

module.exports = React.createClass({
  displayName: 'Fieldset',

  mixins: [EditorMixin],

  getDefaultProps: function(){
    return {
      componentType: 'fieldset'
    };
  },

  getLabel: function(){
    var fieldSetLabel = null;
    if(this.props.name){
      fieldSetLabel = <legend className="field-label" key="legendKey">{this.props.name}</legend>;
    }
    return fieldSetLabel;
  },

  /**
   * Render a Fieldset component.
   * @returns {JSX}
   */
  render: function(){
    return (
      <fieldset key="fieldSetWithComponentsKey" id={this.props.id} className="editable-component">
        {this.getEditController("Fieldset")}
        {this.getLabel()}
        {this.props.children}
      </fieldset>
    );
  }

});