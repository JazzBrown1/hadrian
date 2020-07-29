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
});
