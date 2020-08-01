var shortid = require('shortid');
var { defineModel, authenticate } = require('..');

describe('defineModel()', function () {
  it('throw error if getData() is not a function', function (done) {
    const modelName = shortid.generate();
    try {
      defineModel(modelName, { authenticate: { getData: 'should cause error' } });
      authenticate(modelName);
    } catch (err) {
      done();
    }
  });
  it('throw error if verify is not a function', function (done) {
    const modelName = shortid.generate();
    try {
      defineModel(modelName, { authenticate: { verify: 'should cause error' } });
      authenticate(modelName);
    } catch (err) {
      done();
    }
  });
  it('throw error if array passed into options instead of string', function (done) {
    const modelName = shortid.generate();
    try {
      defineModel(modelName, { name: [] });
    } catch (err) {
      done();
    }
  });
  it('throw error if unknown property passed to options', function (done) {
    const modelName = shortid.generate();
    try {
      defineModel(modelName, { shouldError: true });
    } catch (err) {
      done();
    }
  });
  it('throw error if unknown property passed to middleware', function (done) {
    const modelName = shortid.generate();
    try {
      defineModel(modelName);
      authenticate(modelName, { shouldError: true });
    } catch (err) {
      done();
    }
  });
  it('throw error if wrong option type passed to middleware', function (done) {
    const modelName = shortid.generate();
    try {
      defineModel(modelName);
      authenticate(modelName, { onError: 'Error' });
    } catch (err) {
      done();
    }
  });
});
