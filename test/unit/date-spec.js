import React from 'react';
import update from 'react/lib/update';
import DateComponent from '../../src/Date';
import TestUtils from 'react/lib/ReactTestUtils';
import _ from 'lodash';
import fixture from '../fixtures/field-date.json';

describe('Date input', function() {

  it('can render a date input', function() {
    let comp = TestUtils.renderIntoDocument(<DateComponent {...fixture}/>);
    let container = comp.getDOMNode();
    let dom = container.childNodes[0];
    expect(container.id).toEqual(fixture.id);
    expect(dom.tagName.toLowerCase()).toEqual('input');
    expect(dom.name).toEqual(fixture.name);
    expect(dom.value).toEqual(fixture.value);
    expect(dom.getAttribute('disabled')).toBeNull();
  });

  it('can render an input with today\'s date', function() {
    let config = update(fixture, {value: {$set: 'today'}});
    let comp = TestUtils.renderIntoDocument(<DateComponent {...config}/>);
    let container = comp.getDOMNode();
    let dom = container.childNodes[0];
    // get today's date for comparison
    let today = new Date();
    let dd = today.getDate();
    // January is 0
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    today = `${mm}/${dd}/${yyyy}`;
    expect(dom.value).toEqual(today);
  });

  it('can update date input value', function() {
    let comp = TestUtils.renderIntoDocument(<DateComponent {...fixture}/>);
    let container = comp.getDOMNode();
    let dom = container.childNodes[0];
    expect(dom.value).toEqual(fixture.value);
    TestUtils.Simulate.change(dom, {target: {value: '03/15/2013'}});
    expect(dom.value).toEqual('03/15/2013');
  });

  it('can update time input value', function() {
    let timeFixture = _.merge(fixture, {calendar: false, time: true, format: 'HH:mm'});
    let comp = TestUtils.renderIntoDocument(<DateComponent {...timeFixture}/>);
    let container = comp.getDOMNode();
    let dom = container.childNodes[0];
    expect(dom.value).toEqual('00:00');
    TestUtils.Simulate.change(dom, {target: {value: '02:00'}});
    expect(dom.value).toEqual('02:00');
  });

  describe('#getDateValue', () => {
    it('will return today\'s date if value is "today"', () => {
      let result = DateComponent.getDateValue('today').toDateString();
      let now = new Date().toDateString();
      expect(result).toBe(now);
    });

    it('will parse and return a UTC timestamp', () => {
      let result = DateComponent.getDateValue('09/24/1981').toDateString();
      let fixture = new Date('9/24/1981').toDateString();
      expect(result).toBe(fixture);
    });
  });

});
