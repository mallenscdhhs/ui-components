'use-strict';
import React from 'react';
import constants from './constants';
import Action from './Action';

class EntryListAddBtn extends React.Component {
  /**
   * Only render the Add New button if the "show" property is true.
   */
  render(){
    return ( this.props.show ) ? (
      <div className={this.props.id}/>
    ) : <Action {...this.props}/>;
  }
}

EntryListAddBtn.propTypes = {
  id: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  event: React.PropTypes.string.isRequired,
  iconClass: React.PropTypes.string,
  className: React.PropTypes.string
};

EntryListAddBtn.defaultProps = {
  id: 'add-entry-btn',
  type: 'button',
  event: constants.actions.ENTRYLIST_FORM_SHOW,
  iconClass: 'plus',
  className: 'btn btn-primary'
};

export default EntryListAddBtn;
