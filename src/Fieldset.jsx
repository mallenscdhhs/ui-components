var React = require('react/addons');
var _ = require('underscore');
var Layout = require('./Layout');

var componentTypes = {
  field: React.createFactory(require('./Field')),
};

var Fieldset = React.createClass({

  /**
   * Load the initial state of the component from any passed-in props, and
   * set defaults for any props that were not set.
   * @returns {object}
   */
  getInitialState: function(){
    var state = _.extend({ componentParts : '' }, this.props);
    return state;
  },

  /**
   * Render a Fieldset component.
   * @returns {JSX}
   */
  render: function(){
    /*
    * Used only during dev
    if ( this.props.components ) {
      this.props.componentParts = this.props.components.map(function(component){
        return componentTypes[component.type](component.config);
      });
    } 
    */

    return (
        <fieldset key="fieldSetWithComponentsKey">
          <legend className="field-label" key="legendKey">{this.props.name}</legend>
          <Layout schema={this.state.layout} components={this.state.components}/>
        </fieldset>
      );
  }
});

module.exports = Fieldset;
