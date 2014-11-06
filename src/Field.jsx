var React = require('react/addons');
var _ = require('underscore');

var Field = React.createClass({

  /**
   * Load the initial state of the component from any passed-in props, and
   * set defaults for any props that were not set.
   * @returns {object}
   */
  getInitialState: function(){
    var state = _.extend({ type: 'text', name : '', label : '', required : false }, this.props);
    return state;
  },

  /**
   * Wraps label and returns template
   * @returns {JSX template}
   */
  getLabel : function(){
    return (
        <div className="field-label">
          {this.state.label}
        </div>
      )
  },

  /**
   * Creates specified field type template
   * @returns {JSX template}
   */
  getField : function(){
      var fieldType = this.state.type;
      var field = null;

      switch(fieldType){
        case 'text':
          field = <input type="text" placeholder="" className="input-text" />
          break;
      }

      return field;
  },

  /**
   * Wraps label and field templates and returns new template
   * @returns {JSX template}
   */
  renderFieldWithLabel : function(label,field){
    return  (
      <div >
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
    return this.renderFieldWithLabel(
      this.getLabel(),
      this.getField()
    );
  }
});

module.exports = Field;
