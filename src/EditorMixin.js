var Queue = require('./EventQueue');

module.exports = {

  /**
   * Stop event prop and push event to Queue, enabling global app to open the config editor window.
   * We only need to send the component's "id" property to the config tool since it will already
   * have the component config data.
   * @param {object} e - Event object
   */
  handleConfigEdit: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Queue.push({entityEvent: 'component:edit', data: this.props.id});
  },

  /**
   * Stop even prop and push event to Queue, enabling global app to open the config editor window.
   * @param e Event
   */
  handleConfigAdd: function (e) {
    e.preventDefault();
    e.stopPropagation();
    Queue.push({entityEvent:'component:add:new', data: this.props.id});
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
   * Create edit component html handler.
   * @param {string} 
   * @returns {JSX Template}
   */
  getEditController: function() {    
    return (
      <div className="config-editor">
        {this.getAddButton(this.props.type.toLowerCase())}
        <span onClick={this.handleConfigEdit} className="edit-component">
          <span className="glyphicon glyphicon-cog"></span>
        </span>
      </div>
    );
  }
};