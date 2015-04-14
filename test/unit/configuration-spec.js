var React = require('react');
var Components = require('../../src/main');
var TestUtils = require('react/lib/ReactTestUtils');
var configuration = require('../../src/configuration');

var apiFixture = {
  "API" : {
    "validate" : "test/validate",
    "options" : "test/options",
    "page" : "test/page"
  }
};

describe('Configuration', function() {

  it('can load a passed in config', function () {
    expect(configuration.API).toBeUndefined();
    Components.configure(apiFixture);
    expect(configuration.API.validate).toEqual(apiFixture.API.validate);
    expect(configuration.API.options).toEqual(apiFixture.API.options);
    expect(configuration.API.page).toEqual(apiFixture.API.page);
  });

});