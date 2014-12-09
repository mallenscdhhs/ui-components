var React = require('react/addons');
var EditorMixin = require('./EditorMixin');

module.exports = React.createClass({
  displayName: 'Fieldset',

  mixins: [EditorMixin],

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
    var fsKey = this.props.name ? (this.props.name).replace(/ /g,'_') : '';
    return (
      <fieldset key={"fieldSetWithComponentsKey"+fsKey} className="editable-component">
        {this.getEditController("Fieldset")}
        {this.getLabel()}
        {this.props.children}
      </fieldset>
    );
  }

});