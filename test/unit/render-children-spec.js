import React from 'react';
import renderChildren from '../../src/render-children';
import Factory from '../../src/Factory';

describe('render-children', () => {
  it('allows a parent created by factory to rerender its children on schema update', () => {
    let child = React.createElement('input', {type: 'text', id: 'field1', name: 'test'});
    let children = [child];
    expect(children[0].props.hasOwnProperty('disabled')).toBe(false);
    let schema = {
      components: {
        field1: {
          type: 'input',
          config: {
            type: 'text',
            name: 'test',
            id: 'field1',
            disabled: true
          }
        }
      }
    };
    let result = renderChildren({schema, children});
    let resultElement = result._reactFragment['.0'];
    expect(resultElement.props.disabled).toBe(true);
    expect(resultElement.props.schema).toBeDefined();
  });
});
