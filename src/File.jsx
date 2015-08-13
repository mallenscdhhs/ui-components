'use-strict';
import React from 'react';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from './constants';
import _ from 'lodash';
import Immutable from 'immutable';
import FileListItem from './FileListItem';

let {
  FILE_PREVIEW_LIST_GET,
  FILE_PREVIEW_LIST_LOAD,
  FILE_UPLOAD_PREVIEW_REMOVE,
  FIELD_VALUE_CHANGE
} = constants.actions;

/**
* Renders an <input> control with type of file and a file preview list.
* @module File
 */
class File extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      files: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.buildChangeEvent = this.buildChangeEvent.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  componentWillMount() {
    if (Array.isArray(this.props.value)) {
      this.setState({files: this.props.value});
    } else {
      Flux.doAction(FILE_PREVIEW_LIST_GET, {fieldId: this.props.id});
    }
  }

  componentWillReceiveProps(nextProps) {
    let files = nextProps.value || nextProps.files;
    let value = nextProps.value;
    this.setState({files, value});
  }

  componentDidMount() {
    // on fetch of file preview list on intial render
    Dispatcher.register(`${this.props.id}-load-file-preview-list`, (action, data) => {
      if (action === FILE_PREVIEW_LIST_LOAD && data.fieldId === this.props.id) {
        // remember not to set value here, only files (will get security errors from file reader api)
        this.setState({files: Array.isArray(data.value) ? data.value : []});
      }
    });

    // when the user clicks a remove link
    Dispatcher.register(`${this.props.id}-remove-file-preview`, (action, data) => {
      if (action === FILE_UPLOAD_PREVIEW_REMOVE && data.dataParent === this.props.id) {
        let files = Immutable.List(this.state.files);
        let remainingFiles = files.remove(data.removalId).toJSON();
        this.setState({files: remainingFiles});
        this.buildChangeEvent(remainingFiles);
      }
    });
  }

  componentWillUnmount() {
    Dispatcher.unregister(`${this.props.id}-load-file-preview-list`);
    Dispatcher.unregister(`${this.props.id}-remove-file-preview`);
  }

  handleInputChange(e) {
    let self = this;
    // get the latest file from FileList API
    let file = e.target.files[0];
    // create a FileReader to get the binary data for displaying preview img
    let reader = new FileReader();
    // event handler, after all data has been read by FileReader
    reader.onloadend = () => {
      // add binary to the files object and build the change event
      _.merge(file, {binary: reader.result});
      let files = self.state.files.concat(file);
      self.buildChangeEvent(files);
    };
    // starts the file reading process
    reader.readAsDataURL(file);
  }

  buildChangeEvent(files) {
    let event = {
      id: this.props.id,
      name: this.props.name,
      type: 'file',
      value: files
    };
    let actionName = this.props.fieldValueChangeAction || FIELD_VALUE_CHANGE;
    Flux.doAction(actionName, event).then(() => {
      this.setState({files: files});
    });
  }

  renderPreview() {
    let files = this.state.files;
    if (files.length) {
      return (
        <ul className="file-preview-list man pan">
          {files.map((file, fileIdx) => {
            return (
              <FileListItem
                key={`file-preview-${fileIdx}`}
                file={file}
                fileIdx={fileIdx}
                dataParent={this.props.id} />
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
