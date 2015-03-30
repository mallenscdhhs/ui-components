/* jshint node:true */
var React = require('react');
var Flux = require('fluxify');
var constants = require('./constants');
var Action = require('./Action');
var _ = require('lodash');

module.exports = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    actions: React.PropTypes.arrayOf(React.PropTypes.object),
    id: React.PropTypes.string.isRequired,
    show: React.PropTypes.bool,
    sizeClassNames: React.PropTypes.arrayOf(React.PropTypes.string),
    footerClassNames: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getDefaultProps: function(){
    return {
      show: false,
      componentType: 'modal',
      sizeClassNames: [],
      footerClassNames: []
    };
  },

  componentDidMount: function() {
    var node = this.getDOMNode();
    $(node).on('hidden.bs.modal', function(e){
      Flux.doAction(constants.actions.MODAL_HIDE);
    });
  },

  componentDidUpdate: function() {
    var node = this.getDOMNode();
    var $modal = $(node).modal({show: this.props.show});
  },

  render: function() {
    return (
      <div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby="editComponentModal" aria-hidden="true">
        <div className={['modal-dialog'].concat(this.props.sizeClassNames).join(' ')}>
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
            <div className={['modal-footer'].concat(this.props.footerClassNames).join(' ')}>
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
