var Flux = require('fluxify');
var constants = require('./constants');
var React = require('react');

module.exports = React.createClass({

  /**
   * Stop event prop and push event to Queue, enabling global app to open the config editor window.
   * Publishes the component's props.
   * @fires component:edit
   * @param {object} e - Event object
   */
  handleConfigEdit: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Flux.doAction( constants.actions.COMPONENT_EDIT ,  this.props  );
  },

  /**
   * Stop even prop and push event to Queue, enabling global app to open the config editor window.
   * Publishes the component's props.
   * @fires component:add:new
   * @param e Event
   */
  handleConfigAdd: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Flux.doAction( constants.actions.COMPONENT_ADD ,  this.props);
  },

  /**
   * Only show an add button if the component can have children(which 'field' and 'action' cannot).
   * @param {string} type - the type of component
   * @returns {JSX}
   */
  getAddButton: function(type){
    if(type !== 'field' && type !== 'action'){
      return (
        <span onClick={this.handleConfigAdd} className="add-component">
          <span className="glyphicon glyphicon glyphicon-plus"></span>
        </span>
      );
    }
  },

  /**
   * Create edit component HTML and handle click events.
   * @returns {JSX}
   */
  render: function() {
    return (
      <div className="config-editor">
        <span className="config-editor-label">{this.props.componentType}</span>
        {this.getAddButton(this.props.componentType.toLowerCase())}
        <span onClick={this.handleConfigEdit} className="edit-component">
          <span className="glyphicon glyphicon-cog"></span>
        </span>
      </div>
    );
  }
});
