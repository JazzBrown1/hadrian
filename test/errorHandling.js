var shortid = require('shortid');
var assert = require('assert');
var { Model } = require('..');

const expressChain = require('./expressChain');

describe('default error handling', function () {
  it('passes error to express next call back to trigger express default handling', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {}
    };
    const res = {};
    const auth = new Model({ name: modelName, sessions: { useSessions: false }, authenticate: { getData: () => { throw Error('ERROR'); }, selfInit: true, onSuccess: () => { throw Error('called success'); } } }, true);
    expressChain(auth.authenticate())(req, res, (r, rr, error) => {
      done(assert.equal(error.message, 'ERROR'));
    });
  });
  it('throws a default error if a falsey err is thrown', function (done) {
    const modelName = shortid.generate();
    const req = {
      body: {}
    };
    const res = {};
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
      authenticate: {
        // eslint-disable-next-line no-throw-literal
        getData: () => { throw false; },
        selfInit: true,
        onSuccess: () => { throw Error('called success'); }
      }
    });
    expressChain(auth.authenticate())(req, res, (r, rr, error) => {
      done(assert.equal(Boolean(error.message), true));
    });
  });
});
