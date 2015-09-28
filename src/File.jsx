'use-strict';
import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';
import {Button} from 'react-bootstrap';

/**
* Renders an <input> control with type of file and a file preview list.
* @module File
 */
class File extends React.Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderEditBtn = this.renderEditBtn.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
  }

  handleClick(e) {
    e.component = {
      id: this.props.id,
      schemaUpdates: {
        file: {},
      }
    };
  }

  handleInputChange(e) {
    // get the latest file from FileList API
    let file = e.target.files[0];
    e.component = {
      file: {
        id: this.props.id,
        name: this.props.name,
        properties: file
      },
      modelUpdates: {}
    };
  }

  renderInput() {
    return (
      <input
        {...this.props}
        type="file"
        value={this.props.value}
        onChange={this.handleInputChange} />
    );
  }

  renderEditBtn() {
    if (!this.props.readOnly) {
      return (
        <Button
          id={`edit-link-${this.props.id}`}
          className="text-left"
          bsStyle="link"
          onClick={this.handleClick}>
            edit
        </Button>
      );
    }
  }

  renderPreview() {
    return (
      <div>
        <Button
          id={`preview-link-${this.props.id}`}
          className="text-left"
          bsStyle="link"
          href={this.props.file.binary}
          target="_blank">
            {`preview ${this.props.file.name}`}
        </Button>
        {this.renderEditBtn()}
      </div>
    );
  }

  render() {
    return _.isEmpty(this.props.file) ? (
      this.renderInput()
    ) : (
      this.renderPreview()
    );
  }
}

File.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  file: React.PropTypes.object,
  className: React.PropTypes.string,
  readOnly: React.PropTypes.bool
};

File.defaultProps = {
  id: '',
  name: '',
  file: {},
  className: '',
  readOnly: false
};

export default File;
