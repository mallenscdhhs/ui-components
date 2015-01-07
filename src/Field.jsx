'use-strict';
var React = require('react');
var _ = require('lodash');
var Queue = require('./EventQueue');
var EditorToggle = require('./EditorToggle');
var FieldMixin = require('./FieldMixin');
var FieldGroup = require('./FieldGroup');
var DependencyMixin = require('./DependencyMixin');
var Checkable = require('./Checkable');
var Select = require('./Select');
var Input = require('./Input');
var Textarea = require('./Textarea');
var AutoComplete = require('./AutoComplete');
var ContentEditor = require('./ContentEditor');

module.exports = React.createClass({

  displayName: 'Field',

  mixins: [FieldMixin, DependencyMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    required: React.PropTypes.bool,
    helpText: React.PropTypes.string,
    persistInSession: React.PropTypes.bool,
    dependency: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired,
      initialState: React.PropTypes.oneOf(['hidden', 'visible']).isRequired
    }),
    options: React.PropTypes.shape({
      items: React.PropTypes.arrayOf(React.PropTypes.object),
      name: React.PropTypes.string
    })
  },

  getDefaultProps: function(){
    return {
      componentType: 'field'
    };
  },

  /**
   * Upon mounting, subscribe to any dependency that the field has, an monitor the field
   * for events that would require you to make a state change.
   * @returns {void}
   */
  componentDidMount: function(){
    // Listen for validation errors from application
    Queue.subscribe('field:error:'+this.props.id,'field:'+this.props.id,function(data){
      // Change from initial display state.
      this.setState({'hasError': data.hasError,'errorMessage':data.errorMessage});
    }.bind(this));
  },

  /**
   * UnSubscribe from any dependent field events that the current field was listening to.
   * @returns {void}
   */
  componentWillUnmount: function(){
    Queue.unSubscribe('field:error:'+this.props.id,'field:'+this.props.id);
  },

  /**
   * Init Field state, including if the field is viewable based on a dependency
   * @returns {object}
   */
  getInitialState: function() {
    return {
      display: (!this.hasDependency() || this.props.dependency.initialState !=='hidden'),
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
    return (this.props.type === 'radio' || this.props.type === 'checkbox') && this.props.options;
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
