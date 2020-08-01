var shortid = require('shortid');
var assert = require('assert');
var { defineModel, authenticate } = require('..');

const expressChain = require('./expressChain');

describe('default error handling', function () {
  it('passes error to express next call back to trigger express default handling', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {}
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: false }, authenticate: { getData: () => { throw Error('ERROR'); }, selfInit: true, onSuccess: () => { throw Error('called success'); } } }, true);
    expressChain(authenticate(modelName))(req, res, (r, rr, error) => {
      done(assert.equal(error.message, 'ERROR'));
    });
  });
  it('throws a default error if a falsey err is thrown', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {}
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: false }, authenticate: { getData: () => { throw false; }, selfInit: true, onSuccess: () => { throw Error('called success'); } } }, true);
    expressChain(authenticate(modelName))(req, res, (r, rr, error) => {
      done(assert.equal(Boolean(error.message), true));
    });
  });
});
