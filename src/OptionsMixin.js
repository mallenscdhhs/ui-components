var Queue = require('./EventQueue');
var React = require('react');

module.exports = {

  propTypes: {
    options: React.PropTypes.shape({
      items: React.PropTypes.arrayOf(React.PropTypes.object),
      name: React.PropTypes.string
    }).isRequired
  },

  /**
   * Set the options state for this field.
   * @param {array} data - an array of option configs
   */
  updateOptions: function(data){
    this.setState({ options: data });
  },

  /**
   * Load in the options state either from config props or
   * ask the parent app to load them from the server.
   * @fires field:mount:{id}
   */
  componentDidMount: function(){
    if ( this.props.options.items ) {
      this.setState({options: this.props.options.items});
    } else {
      Queue.subscribe('field:options:'+this.props.id , 'field:'+this.props.id , this.updateOptions);
      Queue.push({ entityEvent: 'load:options', data: {
          resourceName: this.props.options.name,
          fieldId: this.props.id
        }
      });
    }
  },

  /**
   * Remove all event listeners.
   */
  componentWillUnmount: function(){
    Queue.unSubscribe('field:options:'+this.props.id, 'field:'+this.props.id);
  }
};
