var React = require('react');
var _ = require('lodash');
var Queue = require('./EventQueue');
var Modal = require('./Modal');


/**
 * Remove Child Component
 * List item in Edit Modal, for a child component.
 */
var RemoveComponent = React.createClass({
  handleClick: function(){
    Queue.push({
      entityEvent: 'component:remove:'+this.props.config.id,
      data: {
        type: this.props.type,
        id: this.props.config.id
      }
    });
  },
  render: function() {
    return (
      <div className="component-subs-list-item">
        <span className="glyphicon glyphicon-remove pull-left" onClick={this.handleClick}></span>
        {this.props.type} - {this.props.config.name}
      </div>
    );
  }
});

/**
 * Creates Modal for Editing Components
 * @module ConfigEditor
 */
module.exports = React.createClass({

    propTypes: {
      id: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired,
      actions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
      componentChildren: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    getInitialState: function(){
      return {};
    },

    /**
     * Returns the current state of the the thing being edited.
     * This method would be called by the parent application.
     * @returns {object}
     */
    getState: function(){
      return this.state;
    },

    /**
     * Subscribe to value changes from the editor form fields and update the
     * internal state of the component config.
     */
    componentDidMount: function(){
      Queue.subscribe('all', 'configeditor', function(data,event){
        if(event.lastIndexOf('field:value:change') >= 0) {
          var state = {};
          state[data.name] = data.value;
          this.setState(state);
        }
      }.bind(this));
    },

    /**
     * Destroy event listeners.
     */
    componentWillUnmount: function(){
      Queue.unSubscribe('field:value:change', 'configeditor');
    },

    render: function() {
      return (
        <Modal {...this.props}>
          <div id="edit-modal-container">
            {this.props.children}
          </div>
          <div id="edit-modal-subs">
            {_.map(this.props.componentChildren, function(child){
              child.key = child.config.name + '-remove';
              return <RemoveComponent {...child} />;
            })}
          </div>
        </Modal>
      );
    }
});
