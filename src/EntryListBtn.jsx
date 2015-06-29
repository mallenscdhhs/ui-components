'use-strict';
import React from 'react';
import constants from './constants';
import Action from './Action';

class EntryListBtn extends React.Component {
  /**
   * Only render the Add New button if the "show" property is true.
   */
  render(){
    return ( this.props.show ) ? (
      <div className={this.props.id}/>
    ) : <Action {...this.props}/>;
  }
}

EntryListBtn.propTypes = {
  id: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  event: React.PropTypes.string.isRequired,
  iconClass: React.PropTypes.string,
  className: React.PropTypes.string
};

EntryListBtn.defaultProps = {
  type: 'button',
  className: 'btn btn-primary'
};

export default EntryListBtn;
