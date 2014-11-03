var request = require('superagent');
var ConfigLoader = require('../../src/ConfigLoader');

describe('ConfigLoader mixin', function(){
  it('will issue an AJAX request to retrieve a component instance if "url" property is provided', function(){
    spyOn(request, 'get');
    ConfigLoader.props = { url: 'lib/data/page-config.json' };
    ConfigLoader.componentDidMount();
    expect(request.get.calls.count()).toEqual(1);
    expect(request.get.calls.argsFor(0)[0]).toEqual('lib/data/page-config.json');
  });
});
