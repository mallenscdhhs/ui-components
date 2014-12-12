var Queue = require('./EventQueue');

module.exports = {

    /**
     * Stop even prop and push event to Queue, enabling global app to open the config editor window.
     * @param e Event
     */
    handleConfigEdit: function (e) {
        e.preventDefault();
        e.stopPropagation();
        Queue.push({'entityEvent':'component:edit:'+this.props.name,'data':{'id': this.props.id,'name':this.props.name,'props':this.props,'type':this.props.ComponentType}});
    },

    /**
     * Stop even prop and push event to Queue, enabling global app to open the config editor window.
     * @param e Event
     */
    handleConfigAdd: function (e) {
        e.preventDefault();
        e.stopPropagation();
        Queue.push({'entityEvent':'component:add:new:'+this.props.name,'data':{'id': this.props.id,'name':this.props.name,'props':this.props,'type':this.props.ComponentType}});
    },

    getAddButton: function(){
      var addButton;
      if(this.props.ComponentType.toLowerCase() !== 'field' &&
          this.props.ComponentType.toLowerCase() !== 'action'){
          addButton = <span onClick={this.handleConfigAdd} className="add-component"><span className="glyphicon glyphicon glyphicon-plus"></span></span>;
      }
      return addButton;
    },

    /**
     * Create edit component html handler.
     * @param componentName
     * @returns {JSX Template}
     */
    getEditController: function (componentType) {
        this.props.ComponentType = componentType.toLowerCase();
        return <div className="config-editor">
                    {this.getAddButton()}
                    <span onClick={this.handleConfigEdit}  className="edit-component"><span className="glyphicon glyphicon-cog"></span></span>
                </div>;
    }

}