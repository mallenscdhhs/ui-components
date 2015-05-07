import React from 'react';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react/lib/ReactTestUtils';
import fixture from '../fixtures/fieldset.json';

describe('Fieldset component', function() {

  it('Renders fieldset legend', function(){
    let Fieldset = Factory.build(elements, fixture, fixture)[0];
    let fieldset = TestUtils.renderIntoDocument(Fieldset);
    let legend = TestUtils.findRenderedDOMComponentWithTag(fieldset, 'legend');
    expect(legend.getDOMNode().textContent).toEqual(fixture.config.legend);
  });

  it('Renders fieldset container', function(){
    var Fieldset = Factory.build(elements, fixture, fixture)[0];
    var fieldset = TestUtils.renderIntoDocument(Fieldset);
    var inputText = TestUtils.scryRenderedDOMComponentsWithTag(fieldset, 'fieldset');
    expect(inputText.length).toEqual(1);
  });

  it('Renders fieldset fields', function(){
    let Fieldset = Factory.build(elements, fixture, fixture)[0];
    let fieldset = TestUtils.renderIntoDocument(Fieldset);
    let inputText = TestUtils.scryRenderedDOMComponentsWithTag(fieldset, 'input');
    expect(inputText.length).toEqual(Object.keys(fixture.components).length);
  });

});
