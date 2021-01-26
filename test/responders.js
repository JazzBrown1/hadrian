var shortid = require('shortid');
const assert = require('assert');
const expressChain = require('./expressChain');
var { Model } = require('..');

describe('responders', function () {
  it('calls res.send when send prop passed to responder', function (done) {
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
    const res = {
      send: () => done()
    };
    const auth = new Model({ name: modelName, sessions: { useSessions: false }, checkAuthenticated: { onSuccess: { send: 'test' } } });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });

  it('calls res.status().send() when send is passed to responder', function (done) {
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
    const res = {
      status: (code) => ({
        send: (send) => done(assert.equal(send, 'send') && assert.equal(code, 999))
      })
    };
    const auth = new Model({ name: modelName, sessions: { useSessions: false }, checkAuthenticated: { onSuccess: { status: 999, send: 'send' } } });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });
  it('calls res.json when json prop passed to responder', function (done) {
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
    const res = {
      json: () => done()
    };
    const auth = new Model({ name: modelName, sessions: { useSessions: false }, checkAuthenticated: { onSuccess: { json: { test: 'test' } } } });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });
  it('calls res.status().json() when json is passed to responder', function (done) {
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
    const res = {
      status: (code) => ({
        json: (json) => done(assert.deepEqual(json, { page: 'page' }) && assert.equal(code, 999))
      })
    };
    const auth = new Model({ name: modelName, sessions: { useSessions: false }, checkAuthenticated: { onSuccess: { status: 999, json: { page: 'page' } } } });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });
  it('calls res.sendStatus when sendStatus prop passed to responder', function (done) {
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
    const res = {
      sendStatus: () => done()
    };
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
      checkAuthenticated: { onSuccess: { sendStatus: 200 } }
    });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });
  it('calls res.sendStatus when only the status prop passed to responder', function (done) {
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
    const res = {
      sendStatus: () => done()
    };
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
      checkAuthenticated: { onSuccess: { status: 200 } }
    });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });
  it('calls res.redirect when redirect prop passed to responder', function (done) {
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
    const res = {
      redirect: () => done()
    };
    const auth = new Model({
      name: modelName,
      sessions: { useSessions: false },
      checkAuthenticated: { onSuccess: { redirect: 200 } }
    });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });
  it('calls res.status().redirect() when redirect is passed to responder', function (done) {
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
    const res = {
      status: (code) => ({
        redirect: (redirect) => done(assert.equal(redirect, 'page') && assert.equal(code, 999))
      })
    };
    const auth = new Model({ name: modelName, sessions: { useSessions: false }, checkAuthenticated: { onSuccess: { status: 999, redirect: 'page' } } });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });
  it('calls res.render when render is passed to responder', function (done) {
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
    const data = { some: 'data' };
    const res = {
      render: (view, data2) => done(assert.equal(view, 'page') && assert.deepEqual(data, data2))
    };
    const auth = new Model({ name: modelName, sessions: { useSessions: false }, checkAuthenticated: { onSuccess: { render: 'page', renderData: data } } });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });
  it('calls res.render when render is passed to responder and renderData not set', function (done) {
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
    const res = {
      render: (view, data2) => done(assert.equal(view, 'page') && assert.deepEqual({}, data2))
    };
    const auth = new Model({ name: modelName, sessions: { useSessions: false }, checkAuthenticated: { onSuccess: { render: 'page' } } });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });
  it('calls res.status().render() when redirect render passed to responder', function (done) {
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
    const data = { some: 'data' };
    const res = {
      status: (code) => ({
        render: (view, data2) => done(assert.equal(view, 'page') && assert.equal(code, 999) && assert.deepEqual(data, data2))
      })
    };
    const auth = new Model({ name: modelName, sessions: { useSessions: false }, checkAuthenticated: { onSuccess: { status: 999, render: 'page', renderData: data } } });
    expressChain(auth.checkAuthenticated())(req, res, done);
  });

  it('throws an error if non object or function is set', function (done) {
    const modelName = shortid.generate();
    try {
      const auth = new Model({ name: modelName, sessions: { useSessions: false }, checkAuthenticated: { onSuccess: 'should cause error' } });
      auth.checkAuthenticated();
    } catch (err) {
      done();
    }
  });
  it('throws an error unknown responder prop is set', function (done) {
    const modelName = shortid.generate();
    try {
      const auth = new Model({ name: modelName, sessions: { useSessions: false }, checkAuthenticated: { onSuccess: { should_cause: ' error' } } });
      auth.checkAuthenticated();
    } catch (err) {
      done();
    }
  });
  it('allow props without prefix when passed to middleware is set', function () {
    const modelName = shortid.generate();
    const auth = new Model({ name: modelName, sessions: { useSessions: false } });
    auth.checkAuthenticated({ onFail: { redirect: ' /' }, onSuccess: { redirect: ' /' } });
  });
});
