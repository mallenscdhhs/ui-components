var React = require('react/addons');
var _ = require('underscore');

var Field = React.createClass({

  /**
   * Load the initial state of the component from any passed-in props, and
   * set defaults for any props that were not set.
   * @returns {object}
   */
  getInitialState: function(){
    var state = _.extend({ 'type' : 'text', 'name' : '', 'label' : '', 'required' : false, 'options' : { 'items' : [] } }, this.props);
    return state;
  },

  /**
   * Concat relevant classes with spaces for use in class="..."
   * @returns {String}
   */
  classSet : function(classNames){
    if (typeof classNames == 'object') {
      return Object.keys(classNames).filter(function(className) {
        return classNames[className];
      }).join(' ');
    } else {
      return Array.prototype.join.call(arguments, ' ');
    }
  },

  /**
   * Boolean helper if type is radio or checkbox.  Used to determine if we 
   * need to use special wrapper for those field types.
   * @returns {object}
   */
  isCheckboxOrRadio: function () {
    return this.props.type === 'radio' || this.props.type === 'checkbox';
  },

  /**
   * Build Checkbox or Radio template based on type.
   * @returns {JSX template}
   */
  getCheckboxOrRadio : function(){
    var fieldName = this.props.name;
    var fieldType = (this.props.type).toLowerCase();
    var fieldKey = 'option';
    var labelKey = fieldType + 'Label'    
    var fields = this.props.options.items.map(function(item, i){
      fieldKey = fieldType + 'Option' + i;
      labelKey = fieldType + 'Label' + i;
      return (<label key={labelKey}><input type={fieldType} id={fieldName} name={fieldName} value={item.value} key={fieldKey}  /> {item.label}</label>);
    });

    return fields;
  },

  /**
   * Build Select template
   * @returns {JSX template}
   */
  getSelect : function(){
    var fieldName = this.props.name;
    var fieldKey = fieldName +'-fieldSelect';
    return (
        <select className="form-control" key={fieldKey}>
          {this.props.options.items.map(function(item, i){
            return (<option value={item.value} key={i}>{item.label}</option>);
          })}
        </select>
      );
  },    

  /**
   * Wraps label and returns template
   * @returns {JSX template}
   */
  getLabel : function(){
    return (
        <label htmlFor={this.props.name} className="field-label" key="fieldLabel">
          {this.props.label}
        </label>
      )
  },

  /**
   * Creates specified field type template
   * @returns {JSX template}
   */
  getField : function(){
      var fieldType = this.props.type;
      var field = null;

      switch(fieldType){
        case 'text':
          field = (<input type="text" placeholder="" id={this.props.name} className="form-control" key="fieldText" />);
          break;
        case 'textarea':
          field = (<textarea className="form-control"  id={this.props.name}  key="fieldTextarea"></textarea>);
          break; 
        case 'email':
          field = (<input type="email" placeholder="" id={this.props.name} className="form-control"  key="fieldEmail"/>);
          break;   
        case 'phone':
          field = (<input type="tel" placeholder="" id={this.props.name} className="form-control"  key="fieldPhone"/>);
          break;   
        case 'date':
          field = (<input type="date" placeholder="" id={this.props.name} className="form-control"  key="fieldDate"/>);
          break;  
        case 'radio':
          field = this.getCheckboxOrRadio();
          break;   
        case 'checkbox':
          field = this.getCheckboxOrRadio();
          break;      
        case 'select':
          field = this.getSelect();
          break;   
        case 'password':
          field = (<input type="password" id={this.props.name} className="form-control"  key="fieldPassword"/>);
          break;                                                                   
      }

      return field;
  },

  /**
   * Wraps checkbox or radio fields with specific label and field template 
   * and returns new template
   * @returns {JSX template}
   */
  renderCheckboxOrRadioFieldWithLabel : function(label,field){
    var classes = {
      'checkbox': this.props.type === 'checkbox',
      'radio': this.props.type === 'radio'
    };

    return  (
      <div className="form-group" key="fieldRadioCheckboxGroup">
        {label}
        <div className={this.classSet(classes)}>
          {field}
        </div>
      </div>
    );
  },

  /**
   * Wraps label and field templates and returns new template
   * @returns {JSX template}
   */
  renderFieldWithLabel : function(label,field){
    return  (
      <div className="form-group" key="fieldDefaultGroup">
        {label}
        {field}
      </div>
    );
  },

  /**
   * Render a Field component.
   * @returns {JSX}
   */
  render: function(){
    if(this.isCheckboxOrRadio()){
      return this.renderCheckboxOrRadioFieldWithLabel(
        this.getLabel(),
        this.getField()
      );
    }else{
      return this.renderFieldWithLabel(
        this.getLabel(),
        this.getField()
      );
    }

  }
});

module.exports = Field;
