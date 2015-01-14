var React = require('react');
var Components = require('../../src/main');
var TestUtils = require('react/lib/ReactTestUtils');
var configuration = require('../../src/configuration');

var apiFixture = {
  "validate" : "test/validate",
  "options" : "test/options",
  "page" : "test/page"
};

describe('Configuration', function() {

  it('can load a passed in config', function () {
    expect(configuration.API.validate).toBeUndefined();
    expect(configuration.API.options).toBeUndefined();
    expect(configuration.API.page).toBeUndefined();
    Components.configure(apiFixture);
    expect(configuration.API.validate).toEqual(apiFixture.validate);
    expect(configuration.API.options).toEqual(apiFixture.options);
    expect(configuration.API.page).toEqual(apiFixture.page);
  });

});