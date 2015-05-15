'use-strict';
import React from 'react';
import constants from './constants';
import Action from './Action';

/**
* Renders file preview list items for the File component.
* @module FileListItem
 */
class FileListItem extends React.Component {

  render() {
    let files = this.props.files;
    return (
      <div>
        {files.map(function(file, fileIdx) {
          return (
            <li key={'file-preview' + fileIdx} className="file-preview-list-item row mblg">
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
            </li>
          );
        })}
      </div>
    );
  }
}

FileListItem.propTypes = {
  files: React.PropTypes.arrayOf(React.PropTypes.object)
};

FileListItem.getDefaultProps = {
  files: []
};

export default FileListItem;
