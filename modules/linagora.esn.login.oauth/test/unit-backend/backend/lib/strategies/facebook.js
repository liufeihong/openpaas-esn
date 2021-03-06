'use strict';

var mockery = require('mockery');
var expect = require('chai').expect;
var q = require('q');

describe('The facebook oauth login strategy', function() {
  var deps;
  var logger = {
    debug: function() {},
    err: function() {},
    info: function() {}
  };
  var dependencies = function(name) {
    return deps[name];
  };

  beforeEach(function() {
    deps = {
      logger: logger
    };
  });

  describe('The configure function', function() {
    function getModule() {
      return require('../../../../../backend/lib/strategies/facebook')(dependencies);
    }

    it('should callback with error when getCallbackEndpoint service fails', function(done) {
      var msg = 'I failed';

      mockery.registerMock('./commons', function() {
        return {
          getCallbackEndpoint: function() {
            return q.reject(new Error(msg));
          },
          getOAuthConfiguration: function() {
            return q();
          }
        };
      });

      mockery.registerMock('passport', {
        use: function() {
          done(new Error('Should not be called'));
        }
      });

      getModule().configure(function(err) {
        expect(err.message).to.equal(msg);
        done();
      });
    });

    it('should callback with error when getOAuthConfiguration fails', function(done) {
      var msg = 'I failed';

      mockery.registerMock('./commons', function() {
        return {
          getCallbackEndpoint: function() {
            return q();
          },
          getOAuthConfiguration: function() {
            return q.reject(new Error(msg));
          }
        };
      });

      mockery.registerMock('passport', {
        use: function() {
          done(new Error('Should not be called'));
        }
      });

      getModule().configure(function(err) {
        expect(err.message).to.equal(msg);
        done();
      });
    });

    it('should register facebook-login passport if facebook is configured', function(done) {
      mockery.registerMock('./commons', function() {
        return {
          getCallbackEndpoint: function() {
            return q();
          },
          getOAuthConfiguration: function() {
            return q({});
          },
          handleResponse: function() {}
        };
      });

      mockery.registerMock('passport-facebook', {
        Strategy: function() {}
      });

      mockery.registerMock('passport', {
        use: function(name) {
          expect(name).to.equal('facebook-login');
        }
      });

      getModule().configure(done);
    });
  });
});
