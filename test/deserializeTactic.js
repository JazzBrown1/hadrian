var shortid = require('shortid');
const assert = require('assert');
const expressChain = require('./expressChain');

var {
  defineModel, init, authenticate, checkAuthenticated, deserializeUser
} = require('..');

describe('never deserialize tactic', function () {
  it('updates authentication from cookie on new request', function (done) {
    const modelName = shortid.generate();
    const newReq = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: true, deserializeTactic: 'never' } });
    expressChain([init(modelName), authenticate(modelName)])(newReq, res, (req) => {
      const request = { session: req.session };
      expressChain([init(modelName), checkAuthenticated(modelName)])(request, res, () => {
        done();
      });
    });
  });
  it('deserializes user by calling user()', function (done) {
    const modelName = shortid.generate();
    const newReq = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: {
        useSessions: true,
        deserializeTactic: 'never',
        serialize: () => 'serialized',
        deserialize: () => 'deserialized'
      },

      authenticate: { getData: () => 'deserialized' },
    });
    expressChain([init(modelName), authenticate(modelName)])(newReq, res, (req) => {
      const request = { session: req.session };
      expressChain([init(modelName), checkAuthenticated(modelName)])(request, res, (req2) => {
        req2.user().then((user) => {
          assert.equal(user, 'deserialized');
          req2.user().then((user2) => {
            done(assert.equal(user2, 'deserialized'));
          });
        });
      });
    });
  });
  it('passes using default deserialize method()', function (done) {
    const modelName = shortid.generate();
    const newReq = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: { useSessions: true, deserializeTactic: 'never' },
      authenticate: { getData: () => 'user' }
    });
    expressChain([init(modelName), authenticate(modelName)])(newReq, res, (req) => {
      const request = { session: req.session };
      expressChain([init(modelName), checkAuthenticated(modelName)])(request, res, (req2) => {
        req2.user().then((user) => {
          assert.equal(user, 'user');
          req2.user().then((user2) => {
            done(assert.equal(user2, 'user'));
          });
        });
      });
    });
  });
  it('deserializes user by using deserializeUser() middleware', function (done) {
    const modelName = shortid.generate();
    const newReq = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: {
        useSessions: true,
        deserializeTactic: 'never',
        serialize: () => 'serialized',
        deserialize: () => 'deserialized'
      },

      authenticate: { getData: () => 'deserialized' },
    });
    expressChain([init(modelName), authenticate(modelName)])(newReq, res, (req) => {
      const request = { session: req.session };
      expressChain([
        init(modelName),
        checkAuthenticated(modelName),
        deserializeUser(modelName)
      ])(request, res, (req2) => {
        done(assert.equal(req2.deserializedUser, 'deserialized'));
      });
    });
  });
  describe('deserializeUser()', function () {
    it('deserializes user by using deserializeUser() middleware', function (done) {
      const modelName = shortid.generate();
      const newReq = {
        body: {},
        session: {}
      };
      const res = {};
      defineModel(modelName, {
        sessions: {
          useSessions: true,
          deserializeTactic: 'never',
          serialize: () => 'serialized',
          deserialize: () => 'deserialized'
        },

        authenticate: { getData: () => 'deserialized' }
      });
      expressChain([init(modelName), authenticate(modelName)])(newReq, res, (req) => {
        const request = { session: req.session };
        expressChain([
          init(modelName),
          checkAuthenticated(modelName),
          deserializeUser(modelName)
        ])(request, res, (req2) => {
          done(assert.equal(req2.deserializedUser, 'deserialized'));
        });
      });
    });
    it('calls onSuccess when set', function (done) {
      const modelName = shortid.generate();
      const newReq = {
        body: {},
        session: {}
      };
      const res = {};
      defineModel(modelName, {
        sessions: {
          useSessions: true,
          deserializeTactic: 'never',
          serialize: () => 'serialized',
          deserialize: () => 'deserialized'
        },

        authenticate: { getData: () => 'deserialized' },
        deserializeUser: {
          onSuccess: (req) => {
            done(assert.equal(req.deserializedUser, 'deserialized'));
          }
        }
      });
      expressChain([init(modelName), authenticate(modelName)])(newReq, res, (req) => {
        const request = { session: req.session };
        expressChain([
          init(modelName),
          checkAuthenticated(modelName),
          deserializeUser(modelName)
        ])(request, res, () => {
          throw new Error('This should never happen');
        });
      });
    });
    it('calls onError when deserialize invokes error', function (done) {
      const modelName = shortid.generate();
      const newReq = {
        body: {},
        session: {}
      };
      const res = {};
      defineModel(modelName, {
        sessions: {
          useSessions: true,
          deserializeTactic: 'never',
          serialize: () => 'serialized',
          deserialize: () => { throw new Error('error'); }
        },

        authenticate: { getData: () => 'deserialized' },
        deserializeUser: {
          onError: () => done()
        }
      });
      expressChain([init(modelName), authenticate(modelName)])(newReq, res, (req) => {
        const request = { session: req.session };
        expressChain([
          init(modelName),
          checkAuthenticated(modelName),
          deserializeUser(modelName)
        ])(request, res, () => {
          throw new Error('This should never happen');
        });
      });
    });
    it('passes to next mw when user is not authenticated', function (done) {
      const modelName = shortid.generate();
      const request = {
        body: {},
        session: {}
      };
      const res = {};
      defineModel(modelName, {
        sessions: {
          useSessions: true,
          deserializeTactic: 'never',
          serialize: () => 'serialized',
          deserialize: () => 'deserialized',
        },

        authenticate: { getData: () => 'deserialized' },
      });
      expressChain([init(modelName), deserializeUser(modelName)])(request, res, () => {
        done();
      });
    });
    it('allows you to omit model name and use default model', function (done) {
      const modelName = shortid.generate();
      const request = {
        body: {},
        session: {}
      };
      const res = {};
      defineModel(modelName, {
        sessions: {
          useSessions: true,
          serialize: () => 'serialized',
          deserialize: () => 'deserialized',
          deserializeTactic: 'never',
        },
        authenticate: { getData: () => 'deserialized' },
      });
      expressChain([init(modelName), deserializeUser({
        onSuccess: () => done()
      })])(request, res, () => {
        throw new Error('This should never happen');
      });
    });
  });
  it('returns deserialized user by calling user() after auth', function (done) {
    const modelName = shortid.generate();
    const newReq = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, {
      sessions: {
        useSessions: true,
        deserializeTactic: 'never',
        serialize: () => 'serialized',
        deserialize: () => 'deserialized'
      },

      authenticate: { getData: () => 'deserialized' },
    });
    expressChain([init(modelName), authenticate(modelName)])(newReq, res, (req) => {
      req.user().then((user) => {
        done(assert.equal(user, 'deserialized'));
      });
    });
  });
});

describe('always deserialize tactic', function () {
  it('updates authentication from session on new request', function (done) {
    const modelName = shortid.generate();
    const newReq = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: true, deserializeTactic: 'always' } });
    expressChain([init(modelName), authenticate(modelName)])(newReq, res, (req) => {
      const request = { session: req.session };
      expressChain([init(modelName), checkAuthenticated(modelName)])(request, res, () => {
        done();
      });
    });
  });
});
