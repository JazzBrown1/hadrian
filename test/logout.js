var assert = require('assert');
var shortid = require('shortid');
var { Model } = require('..');
const expressChain = require('./expressChain');

describe('auth.logout()', function () {
  it('removes auth and updates isAuthenticated prop', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {
        hadrian: {
          isAuthenticated: true,
          user: 'someUser',
          auth: {
            [modelName]: {
              someProp: 'prop'
            }
          }
        }
      }
    };
    req.hadrian = req.session.hadrian;
    const auth = new Model({ name: modelName, sessions: { useSessions: true } });
    const res = {};
    auth.logout()(req, res, () => {
      assert.equal(req.hadrian.isAuthenticated, false);
      assert.equal(Object.keys(req.hadrian.auth).length, 0);
      done();
    });
  });
  it('throws error if use sessions set to false', function (done) {
    const modelName = shortid.generate();
    const auth = new Model({ name: modelName, sessions: { useSessions: false } });
    try { auth.logout(); } catch (err) { done(); }
  });
  it('calls onSuccess() if set', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {
        hadrian: {
          isAuthenticated: true,
          user: 'someUser',
          auth: {
            [modelName]: {
              someProp: 'prop'
            }
          }
        }
      }
    };
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: true },
      logout: { onSuccess: () => done() }
    });
    const res = {};
    expressChain([auth.init(), auth.logout()])(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  // I think the below is redundant
  it('uses default model if model name is not passed', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {
        hadrian: {
          isAuthenticated: true,
          user: 'someUser',
          auth: {
            [modelName]: {
              someProp: 'prop'
            }
          }
        }
      }
    };
    req.hadrian = req.session.hadrian;
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: true },
      logout: { onSuccess: () => done() }
    }, true);
    const res = {};
    expressChain(auth.logout())(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  it('uses overrides passed as first argument', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {
        hadrian: {
          isAuthenticated: true,
          user: 'someUser',
          auth: {
            [modelName]: {
              someProp: 'prop'
            }
          }
        }
      }
    };
    req.hadrian = req.session.hadrian;
    const auth = new Model({ name: modelName, sessions: { useSessions: true } });
    const res = {};
    expressChain(auth.logout({ onSuccess: () => done() }))(req, res, () => {
      throw new Error('this should never happen');
    });
  });
  it('uses overrides passed as first argument', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {
        hadrian: {
          isAuthenticated: true,
          user: 'someUser',
          auth: {
            [modelName]: {
              someProp: 'prop'
            }
          }
        }
      }
    };
    req.hadrian = req.session.hadrian;
    const auth = new Model({ name: modelName, sessions: { useSessions: true } });
    const res = {};
    expressChain(auth.logout({ onSuccess: () => done() }))(req, res, () => {
      throw new Error('this should never happen');
    });
  });

  it('logs out of associated auth model when there multiple auths', function () {
    const modelName = shortid.generate();
    const modelName2 = shortid.generate();
    const req = {
      body: {},
      session: {
        hadrian: {
          isAuthenticated: true,
          user: 'someUser',
          auth: {
            [modelName]: {
              someProp: 'prop'
            },
            [modelName2]: {
              someProp: 'prop'
            }
          }
        }
      }
    };
    req.hadrian = req.session.hadrian;
    const auth = new Model({ name: modelName, sessions: { useSessions: true } });
    const res = {};
    expressChain(auth.logout())(req, res, () => {
      if (req.session.hadrian.auth[modelName] || !req.session.hadrian.auth[modelName2]) throw new Error('this should never happen');
    });
  });
  it('logs out of all when there multiple auths and logout:of:all selected', function () {
    const modelName = shortid.generate();
    const modelName2 = shortid.generate();
    const req = {
      body: {},
      session: {
        hadrian: {
          isAuthenticated: true,
          user: 'someUser',
          auth: {
            [modelName]: {
              someProp: 'prop'
            },
            [modelName2]: {
              someProp: 'prop'
            }
          }
        }
      }
    };
    req.hadrian = req.session.hadrian;
    const auth = new Model({ name: modelName, sessions: { useSessions: true }, logout: { of: 'all' } });
    const res = {};
    expressChain(auth.logout())(req, res, () => {
      if (req.session.hadrian.auth[modelName] || req.session.hadrian.auth[modelName2]) throw new Error('this should never happen');
    });
  });
});
