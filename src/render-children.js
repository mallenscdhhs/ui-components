'use-strict';
import React from 'react';
import Immutable from 'immutable';

export default function renderChildren(props) {
  return React.Children.map(props.children, (child) => {
    let component = props.schema.components[child.props.id];
    let childConfig = component.config;
    let childProps = Immutable.fromJS(childConfig).set('schema', props.schema);
    return React.cloneElement(child, childProps.toJS(), child.props.children);
  });
};
