var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var AlertMessage = require('../../src/AlertMessage');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;

describe('AlertMessage', function(){
  var alert = TestUtils.renderIntoDocument(<AlertMessage id="test-alert" actionNames={['test']}/>);
  var alertDOM = alert.getDOMNode();
  var hiddenClassName = 'hidden alert alert-dismissible alert-info';

  it('can display a message to the user', function(done){
    Flux.doAction('test', 'info', 'This is a test.').then(function(){
      expect(alertDOM.childNodes[1].textContent).toEqual('This is a test.');
      done();
    });
  });

  it('can display a custom message type', function(done){
    Flux.doAction('test', 'danger', 'This is a test.').then(function(){
      expect(alertDOM.className).toEqual('alert alert-dismissible alert-danger');
      done();
    });
  });

  it('will allow the user to close it', function(){
    TestUtils.Simulate.click(alertDOM.childNodes[0], {});
    expect(alertDOM.className).toEqual(hiddenClassName);
    expect(alertDOM.childNodes[1].textContent).toEqual('');
  });

  it('can autoclose itself after a set duration', function(done){
    Flux.doAction('test', 'info', 'This is a delayed test.', true).then(function(){
      setTimeout(function(){
        expect(alertDOM.className).toEqual(hiddenClassName);
        done();
      }, 1000);
    });
  });
});
