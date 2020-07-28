var assert = require('assert');
var shortid = require('shortid');
var {
  defineModel, authenticate, init, Fail
} = require('..');

// completely inefficient helper function for testing
const expressChain = require('./expressChain');

describe('authenticate()', function () {
  it('should successfully authenticate with default settings', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {}
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: false }, authenticate: { selfInit: true } });
    expressChain(authenticate(modelName))(req, res, () => done());
  });
  it('should save auth info to session object', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: true }, authenticate: { selfInit: true } });
    expressChain(authenticate(modelName))(req, res, () => {
      assert.equal(Boolean(req.session.hadrian.auth[modelName]), true);
      done();
    });
  });
  it('calls onsuccess instead of next when set', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: true }, authenticate: { selfInit: true } });
    expressChain(authenticate(modelName))(req, res, () => {
      assert.equal(Boolean(req.session.hadrian.auth[modelName]), true);
      done();
    });
  });
  it('should import options from default', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onSuccess: () => {
          assert.equal(Boolean(req.session.hadrian.auth[modelName]), true);
          done();
        }
      }
    }, true);
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if verify passes falsy result', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onFail: () => done(),
        verify: () => false
      }
    }, true);
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if verify throws Fail', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onFail: () => done(),
        verify: () => { throw new Fail('failed to verify'); }
      }
    }, true);
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if getData throws Fail', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onFail: () => done(),
        getData: () => { throw new Fail('Failed to get User'); }
      }
    }, true);
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if extract throws Fail', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onFail: () => done(),
        extract: () => { throw new Fail('Couldnt Extract'); }
      }
    }, true);
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if verify passes error', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onError: () => done(),
        verify: (a, b, done2) => done2(true, false)
      }
    }, true);
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if getData passes error', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onError: () => done(),
        getData: (a, done2) => done2(true, false)
      }
    }, true);
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('onFail called if extract passes error', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: true },
      authenticate: {
        selfInit: true,
        onError: () => done(),
        extract: (a, done2) => done2(true, false)
      }
    }, true);
    expressChain(authenticate())(req, res, () => {
      throw new Error('This should never happen');
    });
  });
  it('throws an error if model not set', function (done) {
    try {
      defineModel('test', { clientType: 'test' });
      authenticate('not_set');
    } catch (err) {
      done();
    }
  });
  it('works when separated from init()', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: false },
      authenticate: { selfInit: false }
    }, true);
    expressChain([init(), authenticate()])(req, res, () => {
      done();
    });
  });
  it('uses default model when model name not provided', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {}
    };
    const res = {};
    defineModel(modelName, {
      authenticate: {
        selfInit: true,
        onSuccess: () => done(),
      },
      sessions: {
        useSessions: false,
      }
    }, true);
    expressChain(authenticate())(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  it('allows you to omit model name and pass overrides as first argument', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: false
      }
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: false },
    });
    expressChain(authenticate({ onSuccess: () => done() }))(req, res, () => {
      throw new Error('this should never happen');
    });
  });
});
