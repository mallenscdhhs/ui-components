'use-strict';
import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';
import {Button} from 'react-bootstrap';
import {Input} from 'react-bootstrap';

/**
* Renders an <input> control with type of file and a file preview list.
* @module File
 */
class File extends React.Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderEditBtn = this.renderEditBtn.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
  }

  handleClick(e) {
    e.component = {
      id: this.props.id,
      schemaUpdates: {
        file: null
      }
    };
  }

  handleInputChange(e) {
    e.component = {
      file: {
        id: this.props.id,
        name: this.props.name,
        properties: e.target.files[0]
      }
    };
  }

  renderEditBtn() {
    if (!this.props.readOnly) {
      return (
        <Button
          id={`edit-link-${this.props.id}`}
          className="text-left"
          bsStyle="link"
          onClick={this.handleClick}>
            change
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
    return (
      <Input label={this.props.label} help={this.props.help} bsStyle={this.props.bsStyle}>
        {_.isEmpty(this.props.file) ? (
          // if not readOnly, render file input initially or when the user requests a change
          this.props.readOnly ? (
            <p><strong>No file selected.</strong></p>
          ) : (
            <Input {..._.omit(this.props, 'label', 'help')} onChange={this.handleInputChange}/>
          )
        ) : (
          this.renderPreview()
        )}
      </Input>
    );
  }
}

File.propTypes = {
  id: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string,
  file: React.PropTypes.object,
  className: React.PropTypes.string,
  readOnly: React.PropTypes.bool
};

File.defaultProps = {
  id: '',
  name: '',
  label: '',
  type: 'file',
  file: {},
  className: '',
  readOnly: false
};

export default File;
