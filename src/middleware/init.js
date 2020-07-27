import buildOptions from '../options/buildOptions';
import makeResponder from '../options/makeResponder';
import { alwaysDeserializeInit, manualDeserializeInit } from '../options/deserializers';

const noSessionInit = (options) => {
  if (options.initOnSuccess) {
    const onSuccess = makeResponder(options.initOnSuccess, 'initOnSuccess');
    return (req, res, next) => {
      req.hadrian = { isAuthenticated: false };
      onSuccess(req, res, next);
    };
  }
  return (req, res, next) => {
    req.hadrian = { isAuthenticated: false, auth: {} };
    next();
  };
};

const init = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const options = buildOptions(modelName, overrides, 'init');

  if (!options.useSessions) return noSessionInit(options);

  const { deserialize } = options;
  const onError = makeResponder(options.initOnError, 'initOnError');
  const deserializer = options.deserializeTactic === 'always' ? alwaysDeserializeInit : manualDeserializeInit;

  const initMiddleware = (req, res, next) => {
    if (req.session.hadrian) {
      req.hadrian = req.session.hadrian;
      req.deserializedUser = null;
      if (req.hadrian.user) {
        deserializer(req.hadrian.user, deserialize, req).then((user) => {
          req.user = user;
          next();
        }).catch((err) => { onError(req, res, next, err); });
      } else next();
    } else {
      req.hadrian = { isAuthenticated: false, auth: {} };
      req.session.hadrian = req.hadrian;
      next();
    }
  };

  if (options.initOnSuccess) return [initMiddleware, makeResponder(options.initOnSuccess, 'initOnSuccess')];
  return initMiddleware;
};

export default init;
