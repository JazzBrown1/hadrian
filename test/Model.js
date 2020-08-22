var assert = require('assert');
var shortid = require('shortid');
var {
  Model
} = require('..');

// completely inefficient helper function for testing
const expressChain = require('./expressChain');

describe('Model()', function () {
  it('should successfully create new model instance with with initial settings', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {}
    };
    const res = {};
    const auth = new Model({ sessions: { useSessions: false }, authenticate: { onFail: { send: 'test' }, selfInit: true, onSuccess: () => done() } }, modelName);
    expressChain(auth.authenticate())(req, res, () => {});
  });
  it('overrides on authenticate', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {}
    };
    const res = {};
    const auth = new Model({ sessions: { useSessions: false }, authenticate: { onFail: { send: 'test' }, selfInit: true, onSuccess: () => { throw new Error('Should not happen'); } } }, modelName);
    expressChain(auth.authenticate({ onSuccess: () => done() }))(req, res, () => {});
  });
  it('overrides on logout', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const auth = new Model({ sessions: { useSessions: true }, authenticate: { onFail: { send: 'test' }, selfInit: true }, logout: { onSuccess: () => { throw new Error('Should not happen'); } } }, modelName);
    expressChain([auth.authenticate(), auth.logout({ onSuccess: () => done() })])(req, res, () => {});
  });
  it('overrides on checkAuthenticated', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const auth = new Model({ sessions: { useSessions: true }, authenticate: { onFail: { send: 'test' }, selfInit: true }, checkAuthenticated: { onSuccess: () => { throw new Error('Should not happen'); } } }, modelName);
    expressChain([auth.authenticate(), auth.checkAuthenticated({ onSuccess: () => done() })])(req, res, () => {});
  });
  it('overrides on checkUnauthenticated', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const auth = new Model({ sessions: { useSessions: true }, authenticate: { onFail: { send: 'test' }, selfInit: true }, checkUnauthenticated: { onSuccess: () => { throw new Error('Should not happen'); } } }, modelName);
    expressChain([auth.init(), auth.checkUnauthenticated({ onSuccess: () => done() })])(req, res, () => {});
  });
  it('lets you pass the name in the options object', function () {
    const modelName = shortid.generate();
    const auth = new Model({
      name: modelName, sessions: { useSessions: true }, authenticate: { onFail: { send: 'test' }, selfInit: true }, checkUnauthenticated: { onSuccess: () => { throw new Error('Should not happen'); } }
    });
    auth.init();
  });
});
