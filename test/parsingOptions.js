var shortid = require('shortid');
var { Model } = require('..');

describe('Model() - options parsing', function () {
  it('throw error if getData() is not a function', function (done) {
    const modelName = shortid.generate();
    try {
      // eslint-disable-next-line no-unused-vars
      const auth = new Model({ name: modelName, authenticate: { getData: 'should cause error' } });
    //  auth.authenticate();
    } catch (err) {
      done();
    }
  });
  it('throw error if verify is not a function', function (done) {
    const modelName = shortid.generate();
    try {
      // eslint-disable-next-line no-unused-vars
      const auth = new Model({ name: modelName, authenticate: { verify: 'should cause error' } });
      // auth.authenticate();
    } catch (err) {
      done();
    }
  });
  it('throw error if array passed into options instead of string', function (done) {
    try {
      // eslint-disable-next-line no-unused-vars
      const auth = new Model({ name: [] });
    } catch (err) {
      done();
    }
  });
  it('throw error if unknown property passed to options', function (done) {
    const modelName = shortid.generate();
    try {
      // eslint-disable-next-line no-unused-vars
      const auth = new Model({ name: modelName, shouldError: true });
    } catch (err) {
      done();
    }
  });
  it('throw error if unknown property passed to middleware', function (done) {
    const modelName = shortid.generate();
    const auth = new Model({ name: modelName });
    try {
      auth.authenticate(modelName, { shouldError: true });
    } catch (err) {
      done();
    }
  });
  it('throw error if wrong option type passed to middleware', function (done) {
    const modelName = shortid.generate();
    const auth = new Model({ name: modelName });
    try {
      auth.authenticate(modelName, { onError: 'Error' });
    } catch (err) {
      done();
    }
  });
});
