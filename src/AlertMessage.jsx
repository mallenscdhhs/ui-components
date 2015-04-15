'use-strict';

var React = require('react');
var setClassNames = require('classnames');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var _ = require('lodash');
var constants = require('./constants');

/**
 * Renders an alert at the point in the DOM in which it is inserted.
 * You can specify which actions the AlertMessage responds to by
 * passing in an actionNames array.
 * @module AlertMessage
 */
module.exports = React.createClass({

  displayName: 'AlertMessage',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    actionNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  },

  getInitialState: function(){
    return {
      hidden: true,
      message: '',
      type: 'info'
    };
  },

  /**
   * Regsiter our dispatcher callbacks. Each AlertMessage will listen for
   * the global 'clearAlertMessages' action. You must pass-in a list of
   * actions for each AlertMessage to listen for specifically.
   */
  componentDidMount: function(){
    Dispatcher.register(this.props.id, function(action, type, msg, autoclose){
      if (  _.indexOf(this.props.actionNames, action) >= 0 ) {
        this.setState({
          type: type,
          message: msg,
          hidden: false
        });
        if ( autoclose ) {
          _.delay(this.handleClose, 1000);
        }
      }
    }.bind(this));

    Dispatcher.register(this.props.id+'-clear', function(action, msg){
      if ( action === constants.actions.ALERT_MESSAGES_CLEAR ) {
        this.setState(this.getInitialState());
      }
    }.bind(this));
  },

  componentWillUnmount: function(){
    Dispatcher.unregister(this.props.id);
    Dispatcher.unregister(this.props.id+'-clear');
  },

  /**
   * We can't let bootstrap handle the close action since it will remove the DOM.
   * All we really want to do when the user closes an AlertMessage is to hide it.
   */
  handleClose: function(){
    this.setState(this.getInitialState());
  },

  render: function(){
    var classNames = setClassNames({
      'hidden': this.state.hidden,
      'alert': true,
      'alert-dismissible': true,
      'alert-warning': this.state.type === 'warning',
      'alert-danger': this.state.type === 'danger',
      'alert-info': this.state.type === 'info',
      'alert-success': this.state.type === 'success'
    });
    return (
      <div className={classNames}>
        <button type="button" className="close" onClick={this.handleClose} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        {this.state.message}
      </div>
    );
  }
});
