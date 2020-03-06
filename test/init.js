var shortid = require('shortid');
var { defineModel, init } = require('../dist/hadrian');
const expressChain = require('./expressChain');

describe('init()', function () {
  it('calls onSuccess when passed', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {},
      session: {}
    };
    const res = {};
    defineModel(modelName, { useSessions: true, initOnSuccess: () => done(), deserializeTactic: 'never' });
    expressChain(init(modelName))(req, res, () => {});
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
      useSessions: true,
      initOnError: () => done(),
      deserialize: (user, done2) => done2(true, false)
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
    defineModel(modelName, { useSessions: true });
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
    defineModel(modelName, { useSessions: false, initOnSuccess: () => done() });
    expressChain(init(modelName))(req, res, () => { throw new Error('This should never happen'); });
  });
});
