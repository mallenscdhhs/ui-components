import React from 'react';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react/lib/ReactTestUtils';
import fixture from '../fixtures/form.json';

describe('Form component', function() {

  it('Renders form container', function(){
    let Form = elements.form;
    let formPage = TestUtils.renderIntoDocument(<Form {...fixture.config}/>);
    let inputText = TestUtils.scryRenderedDOMComponentsWithTag(formPage, 'form');
    expect(inputText.length).toEqual(1);
  });

  it('can render a fieldset', function(){
    let Form = Factory.build(elements, fixture, fixture)[0];
    let form = TestUtils.renderIntoDocument(Form);
    expect(TestUtils.scryRenderedDOMComponentsWithTag(form, 'fieldset').length).toEqual(1);
    expect(TestUtils.scryRenderedDOMComponentsWithTag(form, 'input').length).toEqual(1);
  });
});
