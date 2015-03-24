var React = require('react');
var Action = require('./Action');
var _ = require('lodash');

module.exports = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    actions: React.PropTypes.arrayOf(React.PropTypes.object),
    id: React.PropTypes.string.isRequired,
    autoShow: React.PropTypes.bool,
    sizeClassNames: React.PropTypes.arrayOf(React.PropTypes.string),
    footerClassNames: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getDefaultProps: function(){
    return {
      autoShow: false,
      componentType: 'modal'
    };
  },

  /**
  * Return a string of classes for modal-size
  * @return {String}
  */
  getSizeClasses: function(){
    var classes = ['modal-dialog'];

    // Add all passed in classes
    if(this.props.sizeClassNames){
      classes = classes.concat(this.props.sizeClassNames);
    }
    return classes.join(' ');
  },

  /**
  * Return a string of classes for modal-footer
  * @return {String}
  */
  getFooterClasses: function(){
    var classes = ['modal-footer'];

    // Add all passed in classes
    if(this.props.footerClassNames){
      classes = classes.concat(this.props.footerClassNames);
    }
    return classes.join(' ');
  },

  componentDidMount: function(){
    var node = this.getDOMNode();
    var $modal = $(node).modal({show: this.props.autoShow});

    $modal.on('hidden.bs.modal', function(){
      React.unmountComponentAtNode(node);
    });
  },

  render: function() {
    return (
      <div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby="editComponentModal" aria-hidden="true">
        <div className={this.getSizeClasses()}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
              <h4 className="modal-title" id="edit-modal-container-label">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className={this.getFooterClasses()}>
              {_.map(this.props.actions, function(action){
                return <Action {...action}/>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
