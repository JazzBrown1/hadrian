var shortid = require('shortid');
var { defineModel, authenticate } = require('../');

describe('defineModel()', function () {
  it('throw error if getUser() is not a function', function (done) {
    const modelName = shortid.generate();
    defineModel(modelName, { getUser: 'should cause error' });
    try {
      authenticate(modelName);
    } catch (err) {
      done();
    }
  });
  it('throw error if verify is not a function', function (done) {
    const modelName = shortid.generate();
    defineModel(modelName, { verify: 'should cause error' });
    try {
      authenticate(modelName);
    } catch (err) {
      done();
    }
  });
});
