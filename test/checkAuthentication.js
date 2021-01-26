var shortid = require('shortid');
const expressChain = require('./expressChain');
var { Model } = require('../dist/hadrian');

describe('checkAuthentication()', function () {
  it('uses a custom check function when passed to options', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: false,
        auth: {}
      }
    };
    const res = {};
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
      checkAuthentication: {
        check: () => false
      }
    });
    expressChain(auth.checkAuthentication({ onFail: () => done() }))(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  it('should call next when authenticated by self and by: "self" set', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: true,
        auth: {
          [modelName]: 'value'
        }
      }
    };
    const res = {};
    const auth = new Model({ name: modelName, sessions: { useSessions: false } });
    expressChain(auth.checkAuthenticated({ by: 'self' }))(req, res, done);
  });
  it('should call onFail when authenticated by other Method and by: "self" set', function (done) {
    const modelName = shortid.generate();
    const modelName2 = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: true,
        auth: {
          [modelName2]: 'value'
        }
      }
    };
    const res = {};
    const auth = new Model({ name: modelName, sessions: { useSessions: false } });
    expressChain(auth.checkAuthenticated({ by: 'self', onFail: () => done() }))(req, res, () => { throw new Error('This should not happen'); });
  });
  it('should call onFail when not authenticated by any Method and by: "self" set', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: false,
        auth: {}
      }
    };
    const res = {};
    const auth = new Model({ name: modelName, sessions: { useSessions: false } });
    expressChain(auth.checkAuthenticated({ by: 'self', onFail: () => done() }))(req, res, () => { throw new Error('This should not happen'); });
  });
  it('should call next when authenticated by self gand by: "any" set', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: true,
        auth: {
          [modelName]: 'value'
        }
      }
    };
    const res = {};
    const auth = new Model({ name: modelName, sessions: { useSessions: false } });
    expressChain(auth.checkAuthenticated({ by: 'any' }))(req, res, done);
  });
  it('should call next when authenticated by other auth model and by: "any" set', function (done) {
    const modelName = shortid.generate();
    const modelName2 = shortid.generate();
    const req = {
      body: {},
      hadrian: {
        isAuthenticated: true,
        auth: {
          [modelName2]: 'value'
        }
      }
    };
    const res = {};
    const auth = new Model({ name: modelName, sessions: { useSessions: false } });
    expressChain(auth.checkAuthenticated({ by: 'any' }))(req, res, done);
  });
});
it('should call onFail when not authenticated by any Method and by: "any" set', function (done) {
  const modelName = shortid.generate();
  const req = {
    body: {},
    hadrian: {
      isAuthenticated: false,
      auth: {}
    }
  };
  const res = {};
  const auth = new Model({ name: modelName, sessions: { useSessions: false } });
  expressChain(auth.checkAuthenticated({ by: 'any', onFail: () => done() }))(req, res, () => { throw new Error('This should not happen'); });
});
