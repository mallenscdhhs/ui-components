import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import Content from '../../src/Content';

describe('Content component', () => {
  let config = {
    content: 'I am some <b>content</b>.',
    visible: true
  };
  let content = TestUtils.renderIntoDocument(<Content {...config}/>);
  let dom = React.findDOMNode(content);

  it('renders content', () => {
    expect(dom.childNodes[0].textContent).toEqual('I am some ');
    expect(dom.childNodes[1].textContent).toEqual('content');
    expect(dom.childNodes[1].tagName).toEqual('B');
  });
});
