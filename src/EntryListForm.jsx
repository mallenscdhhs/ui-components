'use-strict';
import React from 'react';
import Immutable from 'immutable';
import constants from './constants';
import Factory from './Factory';
import Grid from './Grid';
import Form from './Form';
import Fieldset from './Fieldset';
import Field from './Field';
import Action from './Action';
import Content from './Content';
import setClassNames from 'classnames';

let elements = {
  grid: Grid,
  form: Form,
  fieldset: Fieldset,
  field: Field,
  content: Content
};

class EntryListForm extends React.Component {

  constructor(){
    super();
    this.getClassNames = this.getClassNames.bind(this);
  }
  /**
   * Only update this component if a new form config is provided or the "show"
   * property is changed.
   * @param {object} nextProps - new passed in props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps){
    let currentConfig = Immutable.fromJS(this.props.config);
    let nextConfig = Immutable.fromJS(nextProps.config);
    let isSameConfig = Immutable.is(currentConfig, nextConfig);
    return !isSameConfig || (nextProps.show !== this.props.show);
  }

  getClassNames(){
    return setClassNames({
      'entrylist-form': true,
      'hidden': !this.props.show
    });
  }

  render(){
    return (
      <div className={this.getClassNames()}>
        {Factory.build(elements, this.props.config, this.props.config)[0]}
        <div className="row text-right">
          <div className="col-md-12">
            <Action
              id="add-button"
              type="button"
              className="btn btn-default"
              name={this.props.actionName}
              event={this.props.actionEvent} />
          </div>
        </div>
      </div>
    );
  }
}

EntryListForm.propTypes = {
  show: React.PropTypes.boolean,
  config: React.PropTypes.object,
  actionName: React.PropTypes.string,
  actionEvent: React.PropTypes.string
};

EntryListForm.defaultProps = {
  show: false,
  config: {},
  actionName: '',
  actionEvent: constants.actions.ENTRYLIST_NEW_ENTRY_ADD
};

export default EntryListForm;
