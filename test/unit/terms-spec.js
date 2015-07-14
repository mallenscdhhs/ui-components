import React from 'react';
import Terms from '../../src/Terms';
import TestUtils from 'react/lib/ReactTestUtils';

let fixture = require('../fixtures/terms.json');

describe('Terms', function(){
  let comp = TestUtils.renderIntoDocument(<Terms {...fixture}/>);
  let dom = React.findDOMNode(comp);
  let termsAgreementCheckbox = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input')[0].getDOMNode();

  it('renders a terms textarea with disabled checkbox', function(){
    expect(comp.state.termsRead).toBe(false);
    expect(termsAgreementCheckbox.disabled).toBe(true);
  });

  it('will enable the agreement checkbox upon scrolling to the bottom of the textarea', function(){
    // due to the lack of true scroll event testing: pass in the scrollTop, offsetHeight, scrollHeight values to simulate scrolling to the bottom of the Terms textarea.
    comp.handleScroll(false, 818, 42, 858);
      expect(comp.state.termsRead).toBe(true);
      expect(termsAgreementCheckbox.disabled).toBe(false);
  });
});
