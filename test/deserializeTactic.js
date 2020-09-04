var shortid = require('shortid');
const assert = require('assert');
const expressChain = require('./expressChain');

var {
  Model
} = require('..');

describe('never deserialize tactic', function () {
  it('updates authentication from cookie on new request', function (done) {
    const modelName = shortid.generate();
    const newReq = {
      body: {},
      session: {}
    };
    const res = {};
    const auth = new Model({ name: modelName, sessions: { useSessions: true, deserializeTactic: 'never' } });
    expressChain([auth.init(), auth.authenticate()])(newReq, res, (req) => {
      const request = { session: req.session };
      expressChain([auth.init(), auth.checkAuthenticated()])(request, res, () => {
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
    const auth = new Model({
      name: modelName,
      sessions: {
        useSessions: true,
        deserializeTactic: 'never',
        serialize: () => 'serialized',
        deserialize: () => 'deserialized'
      },

      authenticate: { getData: () => 'deserialized' },
    });
    expressChain([auth.init(), auth.authenticate()])(newReq, res, (req) => {
      req.user().then((user) => {
        assert.equal(user, 'deserialized');
        done(assert.equal(user, 'deserialized'));
      });
    });
  });
  it('deserializes user by calling user() from session', function (done) {
    const modelName = shortid.generate();
    const newReq = {
      body: {},
      session: {}
    };
    const res = {};
    const auth = new Model({
      name: modelName,
      sessions: {
        useSessions: true,
        deserializeTactic: 'never',
        serialize: () => 'serialized',
        deserialize: () => 'deserialized'
      },

      authenticate: { getData: () => 'deserialized' },
    });
    expressChain([auth.init(), auth.authenticate()])(newReq, res, (req) => {
      const request = { session: req.session };
      expressChain([auth.init(), auth.checkAuthenticated()])(request, res, (req2) => {
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
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: true, deserializeTactic: 'never' },
      authenticate: { getData: () => 'user' }
    });
    expressChain([auth.init(), auth.authenticate()])(newReq, res, (req) => {
      const request = { session: req.session };
      expressChain([auth.init(), auth.checkAuthenticated()])(request, res, (req2) => {
        req2.user().then((user) => {
          assert.equal(user, 'user');
          req2.user().then((user2) => {
            done(assert.equal(user2, 'user'));
          });
        });
      });
    });
  });
  it('passes deserializes user using always tactic', function (done) {
    const modelName = shortid.generate();
    const newReq = {
      body: {},
      session: {}
    };
    const res = {};
    const auth = new Model({
      name: modelName,
      sessions: {
        useSessions: true, deserializeTactic: 'always', deserialize: (user) => ({ user }), serialize: ({ user }) => user
      },
      authenticate: { getData: () => ({ user: 'user' }), }
    });
    expressChain([auth.init(), auth.authenticate()])(newReq, res, (req) => {
      const request = { session: req.session };
      expressChain([auth.init(), auth.checkAuthenticated({ onFail: () => { throw new Error('This should not happen'); } })])(request, res, (req2) => {
        done(assert.equal(req2.user.user, 'user'));
      });
    });
  });
});
