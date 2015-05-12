'use-strict';
var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var _ = require('lodash');
var Immutable = require('immutable');
var Action = require('./Action');

/**
* Renders an <input> control with type of file and a file preview list.
* @module File
 */
module.exports = React.createClass({
  displayName: 'File',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    className: React.PropTypes.string
  },

  getDefaultProps: function(){
    return {
      id: '',
      name: '',
      value: '',
      className: ''
    };
  },

  getInitialState: function(){
    return {
      value: '',
      files: []
    };
  },

  componentWillMount: function(){
    this.setState({value: this.props.value});
  },

  componentDidMount: function(){
    // when the user clicks a remove link
    Dispatcher.register('remove-file-preview', function(action, data){
      if ( action === constants.actions.FILE_UPLOAD_PREVIEW_REMOVE ) {
        var files = Immutable.List(this.state.files);
        var remainingFiles = files.remove(data.removalId).toJSON();
        this.setState({ files: remainingFiles });
        this.buildChangeEvent(remainingFiles);
      }
    }.bind(this));
  },

  componentWillUnmount: function(){
    Dispatcher.unregister('remove-file-preview');
  },

  handleInputChange: function(e) {
    var self = this;
    // get the latest file from FileList API
    var file = e.target.files[0];
    // create a FileReader to get the binary data for displaying preview img
    var reader = new FileReader();
    // event handler, after all data has been read by FileReader
    reader.onloadend = function () {
      // add binary to the files object and build the change event
      _.merge(file, {binary: reader.result});
      var files = self.state.files.concat(file);
      self.buildChangeEvent(files);
    };
    // starts the file reading process
    reader.readAsDataURL(file);
  },

  buildChangeEvent: function(files) {
    var self = this;
    var event = {
      id: this.props.id,
      name: this.props.name,
      type: 'file',
      value: files
    };
    Flux.doAction(constants.actions.FIELD_VALUE_CHANGE, event).then(function() {
      self.setState({files: files});
    });
  },

  renderPreview: function() {
    var files = this.state.files;
    if(files.length) {
      return (
        files.map(function(file, fileIdx) {
          return (
            <div key={'file-preview' + fileIdx} className="file-preview-list row mblg">
              <div className="col-md-6">
                <p className="text-left mbn">{file.name}</p>
                <Action
                  id="remove-link"
                  type="link"
                  name="remove"
                  className="text-left"
                  removalId={fileIdx}
                  event={constants.actions.FILE_UPLOAD_PREVIEW_REMOVE} />
              </div>
              <div className="col-md-6">
                <img
                  className="text-right"
                  width="100%"
                  src={file.binary} />
              </div>
            </div>
          );
        })
      );
    }
  },

  render: function(){
    return (
      <div>
        {this.renderPreview()}
        <input
          {...this.props}
          type="file"
          value={this.state.value}
          onChange={this.handleInputChange} />
      </div>
    );
  }

});
