'use-strict';
import React from 'react';
import constants from './constants';
import Action from './Action';

let { FILE_UPLOAD_PREVIEW_REMOVE } = constants.actions;

/**
* Renders file preview list items for the File component.
* @module FileListItem
 */
class FileListItem extends React.Component {

  render() {
    let file = this.props.file;
    return (
      <li className="file-preview-list-item row mblg">
        <div className="col-md-6">
          <p className="text-left mbn">{file.name}</p>
          <Action
            id="remove-link"
            type="link"
            name="remove"
            className="text-left"
            removalId={this.props.fileIdx}
            dataParent={this.props.dataParent}
            event={FILE_UPLOAD_PREVIEW_REMOVE} />
        </div>
        <div className="col-md-6">
          <img
            className="text-right"
            width="100%"
            src={file.binary} />
        </div>
      </li>
    );
  }
}

FileListItem.propTypes = {
  file: React.PropTypes.object,
  fileIdx: React.PropTypes.number
};

FileListItem.defaultProps = {
  file: {},
  fileIdx: 0
};

export default FileListItem;
