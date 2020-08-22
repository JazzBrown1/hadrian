var shortid = require('shortid');
var { defineModel, init } = require('..');
const expressChain = require('./expressChain');

describe('init()', function () {
  it('calls onSuccess when passed', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: true, deserializeTactic: 'never' }, init: { onSuccess: () => done() } });
    expressChain(init(modelName))(req, res, () => {});
  });
  it('lets you override defaults with first argument', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: true, deserializeTactic: 'never' }, init: { onSuccess: () => { throw new Error('should never happen'); } } }, true);
    expressChain(init({ onSuccess: () => done() }))(req, res, () => {});
  });
  it('calls onError if deserialize throws error and onError is passed', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {
        hadrian: {
          user: 'testSerializedUser',
          isAuthenticated: true,
          auth: {
            test: {}
          }
        }
      }
    };
    const res = {};
    defineModel(modelName, {
      sessions: {
        useSessions: true,
        deserialize: (user, done2) => done2(true, false)
      },
      init: { onError: () => done() }
    });
    expressChain(init(modelName))(req, res, () => {});
  });
  it('calls next when no user login but hadrian session exists', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {
        hadrian: {
          isAuthenticated: false,
        }
      }
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: true } });
    expressChain(init(modelName))(req, res, () => { done(); });
  });
  it('calls success middleware when onSuccess is set and useSessions is false', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {
        hadrian: {
          isAuthenticated: false,
        }
      }
    };
    const res = {};
    defineModel(modelName, { sessions: { useSessions: false }, init: { onSuccess: () => done() } });
    expressChain(init(modelName))(req, res, () => { throw new Error('This should never happen'); });
  });
});
