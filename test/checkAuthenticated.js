var shortid = require('shortid');
const expressChain = require('./expressChain');
var { Model } = require('..');

describe('checkAuthenticated()', function () {
  it('should call next when authenticated', function (done) {
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
    const auth = new Model({ name: modelName, sessions: { useSessions: false } });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });
  it('should call onFail when unauthenticated', function (done) {
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
      sessions: {
        useSessions: false
      },
      checkAuthenticated: { onFail: () => done() }
    });
    expressChain(auth.checkAuthenticated())(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  it('calls onFail when fails and set and onSuccess is also set', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: false,
      }
    };
    const res = {};
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
      checkAuthenticated: {
        onSuccess: () => {},
        onFail: () => done()
      }
    });
    expressChain(auth.checkAuthenticated())(req, res, () => {
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
      checkAuthenticated: { onFail: () => done() },
    }, true);
    expressChain(auth.checkAuthenticated())(req, res, () => {
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
    });
    expressChain(auth.checkAuthenticated({ onFail: () => done() }))(req, res, () => {
      throw new Error('this should never happen');
    });
  });
});
