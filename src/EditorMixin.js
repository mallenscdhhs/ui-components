var Queue = require('./EventQueue');

module.exports = {

    /**
     * Stop even prop and push event to Queue, enabling global app to open the config editor window.
     * @param e Event
     */
    handleConfigEdit: function (e) {
        e.preventDefault();
        e.stopPropagation();
        Queue.push({'entityEvent':'component:edit:'+this.props.name,'data':{'name':this.props.name,'props':this.props,'type':this.props.type}});
    },

    /**
     * Create edit component html handler.
     * @param componentName
     * @returns {JSX Template}
     */
    getEditController: function (componentType) {
        this.props.type = componentType.toLowerCase();
        return <div className="config-editor" onClick={this.handleConfigEdit}><span className="glyphicon glyphicon-cog"></span></div>;
    }

}