import React from 'react';
import DateComponent from '../../src/Date';
import TestUtils from 'react/lib/ReactTestUtils';
import _ from 'lodash';
import fixture from '../fixtures/field-date.json';

describe('Date input', function(){

  it('can render a date input', function(){
    let comp = TestUtils.renderIntoDocument(<DateComponent {...fixture}/>);
    let container = comp.getDOMNode();
    let dom = container.childNodes[0];
    expect(container.id).toEqual(fixture.id);
    expect(dom.tagName.toLowerCase()).toEqual('input');
    expect(dom.name).toEqual(fixture.name);
    expect(dom.value).toEqual(fixture.value);
    expect(dom.getAttribute('disabled')).toBeNull();
  });

  it('can update date input value', function(){
    let comp = TestUtils.renderIntoDocument(<DateComponent {...fixture}/>);
    let container = comp.getDOMNode();
    let dom = container.childNodes[0];
    expect(dom.value).toEqual(fixture.value);
    TestUtils.Simulate.change(dom, {target: {value: '03/15/2013'}});
    expect(dom.value).toEqual('03/15/2013');
  });

  it('can update time input value', function(){
    let timeFixture = _.merge(fixture, {calendar: false, time: true, format: 'HH:mm'});
    let comp = TestUtils.renderIntoDocument(<DateComponent {...timeFixture}/>);
    let container = comp.getDOMNode();
    let dom = container.childNodes[0];
    expect(dom.value).toEqual('00:00');
    TestUtils.Simulate.change(dom, {target: {value: '02:00'}});
    expect(dom.value).toEqual('02:00');
  });

});
