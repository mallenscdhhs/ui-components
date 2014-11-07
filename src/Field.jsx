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

  classSet : function(classNames){
    if (typeof classNames == 'object') {
      return Object.keys(classNames).filter(function(className) {
        return classNames[className];
      }).join(' ');
    } else {
      return Array.prototype.join.call(arguments, ' ');
    }
  },

  isCheckboxOrRadio: function () {
    return this.props.type === 'radio' || this.props.type === 'checkbox';
  },

  /**
   * Build Radio template
   * @returns {JSX template}
   */
  getRadio : function(){
    var fieldName = this.props.name;
    var radios = this.props.options.items.map(function(item, i){
      return (<label><input type="radio" id={fieldName} name={fieldName} value={item.value}  /> {item.label}</label>);
    });

    return radios;
  },

  /**
   * Build Checkbox template
   * @returns {JSX template}
   */
  getCheckbox : function(){
    var fieldName = this.props.name;
    var checkboxes = this.props.options.items.map(function(item, i){
      return (<label><input type="checkbox" id={fieldName} name={fieldName} value={item.value}  /> {item.label}</label>);
    });

    return checkboxes;
  },

  /**
   * Build Select template
   * @returns {JSX template}
   */
  getSelect : function(){
    return (
        <select className="form-control">
          {this.props.options.items.map(function(item, i){
            return (<option value={item.value}>{item.label}</option>);
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
        <label htmlFor={this.props.name} className="field-label" /*for={this.props.name} */>
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
          field = (<input type="text" placeholder="" id={this.props.name} className="form-control" />);
          break;
        case 'textarea':
          field = (<textarea className="form-control"  id={this.props.name} ></textarea>);
          break; 
        case 'email':
          field = (<input type="email" placeholder="" id={this.props.name} className="form-control" />);
          break;   
        case 'phone':
          field = (<input type="tel" placeholder="" id={this.props.name} className="form-control" />);
          break;   
        case 'date':
          field = (<input type="date" placeholder="" id={this.props.name} className="form-control" />);
          break;  
        case 'radio':
          field = this.getRadio();
          break;   
        case 'checkbox':
          field = this.getCheckbox();
          break;      
        case 'select':
          field = this.getSelect();
          break;   
        case 'password':
          field = (<input type="password" id={this.props.name} className="form-control" />);
          break;                                                                   
      }

      return field;
  },

  /**
   * Wraps label and field templates and returns new template
   * @returns {JSX template}
   */
  renderCheckboxOrRadioFieldWithLabel : function(label,field){
    var classes = {
      'checkbox': this.props.type === 'checkbox',
      'radio': this.props.type === 'radio'
    };

    return  (
      <div className="form-group">
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
      <div className="form-group">
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
