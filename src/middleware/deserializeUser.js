import buildOptions from '../options/buildOptions';
import makeResponder from '../options/makeResponder';

const deserializeUser = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const options = buildOptions(modelName, overrides, 'deserializeUser');
  const onError = makeResponder(options.deserializeUserOnError, 'deserializeUserOnError');
  const deserializeMiddleware = (req, res, next) => {
    if (!req.user) return next();
    req.user().then(() => { next(); }).catch((err) => { onError(req, res, next, err); });
  };
  if (options.deserializeUserOnSuccess) return [deserializeMiddleware, makeResponder(options.deserializeUserOnSuccess, 'deserializeUserOnSuccess')];
  return deserializeMiddleware;
};

export default deserializeUser;
