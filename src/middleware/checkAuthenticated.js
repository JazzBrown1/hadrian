/* eslint-disable max-len */
import makeResponder from '../constructors/makeResponder';
import buildOptions from '../options/buildOptions';

const checkUnauthenticated = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const options = buildOptions(modelName, overrides, 'checkUnauthenticated').checkUnauthenticated;
  const onFail = makeResponder(options.onFail, 'checkUnauthenticated.OnFail');
  if (!options.onSuccess) {
    return (req, res, next) => {
      if (!req.hadrian.isAuthenticated) return next();
      onFail(req, res);
    };
  }
  const onSuccess = makeResponder(options.onSuccess, 'checkUnauthenticated.onSuccess');
  return (req, res, next) => {
    if (!req.hadrian.isAuthenticated) return onSuccess(req, res, next);
    onFail(req, res);
  };
};

const checkAuthenticated = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const options = buildOptions(modelName, overrides, 'checkAuthenticated').checkAuthenticated;
  const onFail = makeResponder(options.onFail, 'checkAuthenticated.OnFail');
  if (!options.onSuccess) {
    return (req, res, next) => {
      if (req.hadrian.isAuthenticated) return next();
      onFail(req, res);
    };
  }
  const onSuccess = makeResponder(options.onSuccess, 'checkAuthenticated.onSuccess');
  return (req, res, next) => {
    if (req.hadrian.isAuthenticated) return onSuccess(req, res, next);
    onFail(req, res);
  };
};

export {
  checkAuthenticated, checkUnauthenticated
};
