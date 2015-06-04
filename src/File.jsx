'use-strict';
import React from 'react';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from './constants';
import _ from 'lodash';
import Immutable from 'immutable';
import FileListItem from './FileListItem';

/**
* Renders an <input> control with type of file and a file preview list.
* @module File
 */
class File extends React.Component {

  constructor() {
    super();
    this.state = {
      value: '',
      files: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.buildChangeEvent = this.buildChangeEvent.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  componentWillMount() {
    this.setState({value: this.props.value});
  }

  componentDidMount() {
    // when the user clicks a remove link
    Dispatcher.register('remove-file-preview', function(action, data){
      if ( action === constants.actions.FILE_UPLOAD_PREVIEW_REMOVE ) {
        let files = Immutable.List(this.state.files);
        let remainingFiles = files.remove(data.removalId).toJSON();
        this.setState({ files: remainingFiles });
        this.buildChangeEvent(remainingFiles);
      }
    }.bind(this));
  }

  componentWillUnmount() {
    Dispatcher.unregister('remove-file-preview');
  }

  handleInputChange(e) {
    let self = this;
    // get the latest file from FileList API
    let file = e.target.files[0];
    // create a FileReader to get the binary data for displaying preview img
    let reader = new FileReader();
    // event handler, after all data has been read by FileReader
    reader.onloadend = function () {
      // add binary to the files object and build the change event
      _.merge(file, {binary: reader.result});
      let files = self.state.files.concat(file);
      self.buildChangeEvent(files);
    };
    // starts the file reading process
    reader.readAsDataURL(file);
  }

  buildChangeEvent(files) {
    let self = this;
    let event = {
      id: this.props.id,
      name: this.props.name,
      type: 'file',
      value: files
    };
    Flux.doAction(constants.actions.FIELD_VALUE_CHANGE, event).then(function() {
      self.setState({files: files});
    });
  }

  renderPreview() {
    let files = this.state.files;
    if(files.length) {
      return (
        <ul className="file-preview-list man pan">
          {files.map(function(file, fileIdx) {
            return (
              <FileListItem
                key={'file-preview' + fileIdx}
                file={file}
                fileIdx={fileIdx} />
            );
          })}
        </ul>
      );
    }
  }

  renderInput(len, limit) {
    return (len < limit) ? (
      <input
        {...this.props}
        type="file"
        value={this.state.value}
        onChange={this.handleInputChange} />
    ) : <p id="limit-message" className="help-block">{this.props.limitMessage}</p>;
  }

  render() {
    return (
      <div>
        {this.renderPreview()}
        {this.renderInput(this.state.files.length, this.props.limit)}
      </div>
    );
  }
}

File.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
  className: React.PropTypes.string,
  limit: React.PropTypes.number,
  limitMessage: React.PropTypes.string
};

File.defaultProps = {
  id: '',
  name: '',
  value: '',
  className: '',
  limit: 10,
  limitMessage: 'The maximum limit of file uploads has been reached.'
};

export default File;
