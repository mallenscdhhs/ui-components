import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import Terms from '../../src/Terms';
import fixture from '../fixtures/terms.json';

describe('Terms', () => {
  let comp = TestUtils.renderIntoDocument(<Terms {...fixture}/>);
  let dom = React.findDOMNode(comp);
  let legend = TestUtils.findRenderedDOMComponentWithTag(comp, 'legend');
  let checkboxHeader = TestUtils.findRenderedDOMComponentWithClass(comp, 'page-content');
  let termsAgreementCheckbox = TestUtils.findRenderedDOMComponentWithTag(comp, 'input');

  it('renders a terms textarea with legend, optional checkboxHeader, and a disabled attestation checkbox', () => {
    expect(React.findDOMNode(legend).textContent).toEqual(fixture.legend);
    expect(React.findDOMNode(checkboxHeader).textContent).toEqual('If you need text above the checkbox label, put it here!');
    expect(React.findDOMNode(termsAgreementCheckbox).disabled).toBe(true);
    expect(comp.props.termsRead).toBe(false);
  });

  it('will enable the agreement checkbox upon scrolling to the bottom of the textarea', () => {
    // simulate scrolling to the bottom of the Terms textarea.
    let e = {target: {scrollTop: 818, offsetHeight: 42, scrollHeight: 858}};
    comp.handleScroll(e);
    expect(e.component).toBeDefined();
    expect(e.component.schemaUpdates.termsRead).toEqual(true);
  });
});
