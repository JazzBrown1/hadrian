var shortid = require('shortid');
const assert = require('assert');
const expressChain = require('./expressChain');
var { defineModel, checkAuthenticated } = require('../');

describe('responders', function () {
  it('calls res.send when send prop passed to responder', function (done) {
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
    const res = {
      send: () => done()
    };
    defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { send: 'test' } });
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });

  it('calls res.status().send() when send is passed to responder', function (done) {
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
    const res = {
      status: (code) => ({
        send: (send) => done(assert.equal(send, 'send') && assert.equal(code, 999))
      })
    };
    defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { status: 999, send: 'send' } });
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });
  it('calls res.json when json prop passed to responder', function (done) {
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
    const res = {
      json: () => done()
    };
    defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { json: { test: 'test' } } });
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });
  it('calls res.status().json() when json is passed to responder', function (done) {
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
    const res = {
      status: (code) => ({
        json: (json) => done(assert.deepEqual(json, { page: 'page' }) && assert.equal(code, 999))
      })
    };
    defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { status: 999, json: { page: 'page' } } });
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });
  it('calls res.sendStatus when sendStatus prop passed to responder', function (done) {
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
    const res = {
      sendStatus: () => done()
    };
    defineModel(
      modelName,
      { useSessions: false, checkAuthenticatedOnSuccess: { sendStatus: 200 } }
    );
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });
  it('calls res.sendStatus when only the status prop passed to responder', function (done) {
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
    const res = {
      sendStatus: () => done()
    };
    defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { status: 200 } });
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });
  it('calls res.redirect when redirect prop passed to responder', function (done) {
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
    const res = {
      redirect: () => done()
    };
    defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { redirect: 200 } });
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });
  it('calls res.status().redirect() when redirect is passed to responder', function (done) {
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
    const res = {
      status: (code) => ({
        redirect: (redirect) => done(assert.equal(redirect, 'page') && assert.equal(code, 999))
      })
    };
    defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { status: 999, redirect: 'page' } });
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });
  it('calls res.render when render is passed to responder', function (done) {
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
    const data = { some: 'data' };
    const res = {
      render: (view, data2) => done(assert.equal(view, 'page') && assert.deepEqual(data, data2))
    };
    defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { render: 'page', renderData: data } });
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });
  it('calls res.render when render is passed to responder and renderData not set', function (done) {
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
    const res = {
      render: (view, data2) => done(assert.equal(view, 'page') && assert.deepEqual({}, data2))
    };
    defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { render: 'page' } });
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });
  it('calls res.status().render() when redirect render passed to responder', function (done) {
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
    const data = { some: 'data' };
    const res = {
      status: (code) => ({
        render: (view, data2) => done(assert.equal(view, 'page') && assert.equal(code, 999) && assert.deepEqual(data, data2))
      })
    };
    defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { status: 999, render: 'page', renderData: data } });
    expressChain(checkAuthenticated(modelName))(req, res, done);
  });


  it('throws an error if non object or function is set', function (done) {
    const modelName = shortid.generate();
    try {
      defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: 'should cause error' });
      checkAuthenticated(modelName);
    } catch (err) {
      done();
    }
  });
  it('throws an error unknown responder prop is set', function (done) {
    const modelName = shortid.generate();
    try {
      defineModel(modelName, { useSessions: false, checkAuthenticatedOnSuccess: { should_cause: ' error' } });
      checkAuthenticated(modelName);
    } catch (err) {
      done();
    }
  });
  it('allow props without prefix when passed to middleware is set', function () {
    const modelName = shortid.generate();
    defineModel(modelName, { useSessions: false });
    checkAuthenticated(modelName, { onFail: { redirect: ' /' }, onError: { redirect: ' /' }, onSuccess: { redirect: ' /' } });
  });
});
