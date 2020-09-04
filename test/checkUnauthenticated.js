var shortid = require('shortid');
const expressChain = require('./expressChain');
var { Model } = require('..');

describe('checkUnauthenticated()', function () {
  it('should call next when not authenticated', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: false
      }
    };
    const res = {};
    const auth = new Model({ name: modelName, sessions: { useSessions: false } });
    expressChain(auth.checkUnauthenticated())(req, res, done);
  });
  it('should call onFail when authenticated', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: true,
        auth: {
          someProp: 'value'
        }
      }
    };
    const res = {};
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
      checkUnauthenticated: { onFail: () => done() }
    });
    expressChain(auth.checkUnauthenticated())(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  it('calls OnSuccess when set', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: false
      }
    };
    const res = {};
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
      checkUnauthenticated: { onSuccess: () => done() }
    });
    expressChain(auth.checkUnauthenticated())(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  it('calls onFail when fails and set and onSuccess is also set', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: true,
        auth: {
          someProp: 'value'
        }
      }
    };
    const res = {};
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
      checkUnauthenticated: { onFail: () => done(), onSuccess: () => {} }
    });
    expressChain(auth.checkUnauthenticated())(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  it('uses default model when model name not provided', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: false
      }
    };
    const res = {};
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
      checkUnauthenticated: { onSuccess: () => done() },
    }, true);
    expressChain(auth.checkUnauthenticated())(req, res, () => {
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
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
    }, true);
    expressChain(auth.checkUnauthenticated({ onSuccess: () => done() }))(req, res, () => {
      throw new Error('this should never happen');
    });
  });
});
