var assert = require('assert');
// var shortid = require('shortid');
var {
  Model, Fail
} = require('..');

// completely inefficient helper function for testing
const expressChain = require('./expressChain');

describe('authenticate()', function () {
  it('should successfully authenticate with default settings', function (done) {
    const req = {
      body: {}
    };
    const res = {};
    const ops = new Model({ name: 'name', sessions: { useSessions: false }, authenticate: { onFail: () => {}, selfInit: true, onSuccess: () => done() } });
    expressChain(ops.authenticate())(req, res, () => {});
  });
  it('should save auth info to session object', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate } = new Model({ name: 'name', sessions: { useSessions: true }, authenticate: { selfInit: true } });
    expressChain(authenticate())(req, res, () => {
      assert.equal(Boolean(req.session.hadrian.auth.name), true);
      done();
    });
  });
  it('calls onsuccess instead of next when set', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate } = new Model({ name: 'name', sessions: { useSessions: true }, authenticate: { selfInit: true } });
    expressChain(authenticate())(req, res, () => {
      assert.equal(Boolean(req.session.hadrian.auth.name), true);
      done();
    });
  });
  it('should import options from default', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate } = new Model({
      sessions: { useSessions: true },
      name: 'name',
      authenticate: {
        selfInit: true,
        onSuccess: () => {
          assert.equal(Boolean(req.session.hadrian.auth.name), true);
          done();
        }
      }
    });
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if verify passes falsy result', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate } = new Model({
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onFail: () => done(),
        verify: () => false
      }
    });
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if verify throws Fail', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate } = new Model({
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onFail: () => done(),
        verify: () => { throw new Fail('failed to verify'); }
      }
    });
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if getData throws Fail', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate } = new Model({
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onFail: () => done(),
        getData: () => { throw new Fail('Failed to get User'); }
      }
    });
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if extract throws Fail', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate } = new Model({
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onFail: () => done(),
        extract: () => { throw new Fail('Couldnt Extract'); }
      }
    });
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if verify passes error', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate } = new Model({
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onError: () => done(),
        verify: (a, b, done2) => done2(true, false)
      }
    });
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if getData passes error', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate } = new Model({
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onError: () => done(),
        getData: (a, done2) => done2(true, false)
      }
    });
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if extract passes error', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate } = new Model({
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onError: () => done(),
        extract: (a, done2) => done2(true, false)
      }
    });
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('throws an error if model not set', function (done) {
    try {
      const { authenticate } = new Model('test', { clientType: 'test' });
      authenticate('not_set');
    } catch (err) {
      done();
    }
  });
  it('works when separated from init()', function (done) {
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    const { authenticate, init } = new Model({
      sessions: { useSessions: false },
      authenticate: { selfInit: false }
    });
    expressChain([init(), authenticate()])(req, res, () => {
      done();
    });
  });
  it('uses default model when model name not provided', function (done) {
    const req = {
      body: {}
    };
    const res = {};
    const { authenticate } = new Model({
      authenticate: {
        selfInit: true,
        onSuccess: function jazzs() { done(); },
      },
      sessions: {
        useSessions: false,
      }
    });
    expressChain(authenticate())(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  it('allows you to omit model name and pass overrides as first argument', function (done) {
    const req = {
      body: {}
    };
    const res = {};
    const { authenticate } = new Model({
      authenticate: { selfInit: true },
      sessions: { useSessions: false },
    });
    expressChain(authenticate({
      onSuccess: () => done(),
      onError: () => { throw Error('should not call onError'); },
      onFail: () => { throw Error('should not call onSuccess'); }
    }))(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  it('calls on Error if serializer throws error', function (done) {
    const req = {
      body: {},
      session: {},
    };
    const res = {};
    const { authenticate } = new Model({
      authenticate: { selfInit: true },
      sessions: { useSessions: true, serialize: () => { throw new Error('Error'); } }
    });
    expressChain(authenticate({ onError: () => done() }))(req, res, () => {
      throw new Error('this should never happen');
    });
  });
});
