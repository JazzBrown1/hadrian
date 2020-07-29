import buildOptions from '../options/buildOptions';
import makeResponder from '../constructors/makeResponder';

const deserializeUser = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const { onError: onErrorRaw, onSuccess } = buildOptions(modelName, overrides, 'deserializeUser').deserializeUser;
  const onError = makeResponder(onErrorRaw, 'deserializeUserOnError');
  const deserializeMiddleware = (req, res, next) => {
    if (!req.user) return next();
    req.user().then(() => { next(); }).catch((err) => { onError(req, res, next, err); });
  };
  if (onSuccess) return [deserializeMiddleware, makeResponder(onSuccess, 'deserializeUser.onSuccess')];
  return deserializeMiddleware;
};

export default deserializeUser;
