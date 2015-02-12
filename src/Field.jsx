'use-strict';
var React = require('react');
var _ = require('lodash');
var constants = require('./constants');
var EditorToggle = require('./EditorToggle');
var FieldGroup = require('./FieldGroup');
var FieldMixin = require('./FieldMixin');
var ValidationMixin = require('./ValidationMixin');
var DependencyMixin = require('./DependencyMixin');
var Checkable = require('./Checkable');
var Select = require('./Select');
var Input = require('./Input');
var Textarea = require('./Textarea');
var DateComponent = require('./Date');
var AutoComplete = require('./AutoComplete');
var ContentEditor = require('./ContentEditor');

module.exports = React.createClass({

  displayName: 'Field',

  mixins: [FieldMixin, ValidationMixin, DependencyMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    required: React.PropTypes.bool,
    helpText: React.PropTypes.string,
    persistInSession: React.PropTypes.bool
  },

  getDefaultProps: function(){
    return {
      componentType: 'field'
    };
  },

  /**
   * Init Field state, including if the field is viewable based on a dependency
   * @returns {object}
   */
  getInitialState: function() {
    return {
      visible: this.props.initialState === 'visible',
      hasError: false,
      errorMessage: ''
    };
  },

  /**
   * Wrap a field control in the default Bootstrap markup.
   * @param {JSX} field
   * @returns {JSX}
   */
  getDefaultFieldContainer: function(field){
    return (
      <div className={this.getFieldClassNames()}>
        <EditorToggle {...this.props}/>
        <label htmlFor={this.props.id}>{this.props.label}{this.getRequiredIndicator()}</label>
        {field}
        {this.getHelpBlock()}
      </div>
    );
  },

  /**
   * Boolean helper if type is radio or checkbox.  Used to determine if we
   * need to use special wrapper for those field types.
   * Check the type AND if there are available items to show.
   * @returns {object}
   */
  isFieldGroup: function () {
    var isRadio = (this.props.type === 'radio');
    var isCheckbox = (this.props.type === 'checkbox');
    var hasOptions = !!(this.props.options || this.props.optionsResource);
    return (isRadio || isCheckbox) && hasOptions;
  },

  /**
   * Creates specified field type template
   * @returns {JSX template}
   */
  getField : function(){
    var helpKey = 'field'+this.props.id+'HelpText';
    var controlClassName = 'form-control';
    switch(this.props.type){
      case 'contenteditor':
        return this.getDefaultFieldContainer(<ContentEditor className={controlClassName} aria-describedby={helpKey} {...this.props} />);
      case 'textarea':
        return this.getDefaultFieldContainer(<Textarea className={controlClassName} aria-describedby={helpKey} {...this.props} />);
      case 'radio':
      case 'checkbox':
        return <Checkable {...this.props}/>;
      case 'select':
        return this.getDefaultFieldContainer(<Select className={controlClassName} aria-describedby={helpKey} {...this.props} />);
      case 'autocomplete':
        return this.getDefaultFieldContainer(<AutoComplete {...this.props}/>);
      case 'date':
        return this.getDefaultFieldContainer(<DateComponent {...this.props}/>);
      default:
        return this.getDefaultFieldContainer(<Input className={controlClassName} aria-describedby={helpKey} {...this.props} />);
    }
  },

  /**
   * Render a Field component.
   * @returns {JSX}
   */
  render: function(){
    if ( this.isFieldGroup() ) {
      return <FieldGroup {...this.props} />;
    } else {
      return this.getField();
    }
  }

});
