'use-strict';
import React from 'react';
import Flux from 'fluxify';
import setClassNames from 'classnames';
import Tree from './Tree';
import Immutable from 'immutable';
import SchemaUtils from '@scdhhs/ui-component-schema-utils';
import constants from './constants';

class WorkflowItem extends React.Component {

  constructor(props){
    super(props);
  }

  static configure(schema, model, components){
    console.log(schema.getIn(['config','id']));
    console.log(JSON.stringify({components: components}));

    let hasParent = SchemaUtils.getRootId({components: components}, schema.getIn(['config','id']));
    let isNestable = !schema.get('child') && !hasParent;
    let isUnNestable = hasParent;
    let config = Immutable.fromJS(schema.get('config')).withMutations((mutableConfig) => {
      mutableConfig.set('nestable', isNestable).set('unNestable', isUnNestable);
    }).toJSON();
    return config;
  }

  handleClick(e){
    if(!this.props.disabled){
      Flux.doAction( constants.actions.TREE_LOAD_PAGE , { 'id': this.props.id, 'skip': this.props.skip });
    }
  }

  render(){
    var liClassNames = setClassNames({
      'inactive': !this.props.active,
      'current' : this.props.current,
      'disabled': this.props.disabled
    });
    return (
      <li className={liClassNames} role="presentation">
        <a href="javascript:void(0)" data-disabled={this.props.disabled} onClick={this.handleClick.bind(this)}>{this.props.title}</a>
        <Tree>{this.props.children}</Tree>
      </li>
    );
  }

};

WorkflowItem.defaultProps = {
  active: true,
  disabled: false,
  current : false,
  skip: false
};

WorkflowItem.propTypes = {
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  active: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  current: React.PropTypes.bool,
  skip: React.PropTypes.bool
};

export default WorkflowItem;
