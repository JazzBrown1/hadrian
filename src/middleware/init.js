import makeResponder from '../constructors/makeResponder';
import { alwaysDeserializeInit, manualDeserializeInit } from '../misc/deserializers';

const noSessionInit = (options) => {
  if (options.init.onSuccess) {
    const onSuccess = makeResponder(options.init.onSuccess, 'init.onSuccess');
    return (req, res, next) => {
      req.hadrian = { isAuthenticated: false, auth: {} };
      onSuccess(req, res, next);
    };
  }
  return (req, res, next) => {
    req.hadrian = { isAuthenticated: false, auth: {} };
    next();
  };
};

const init = (options) => {
  if (!options.sessions.useSessions) return noSessionInit(options);
  const { deserialize, deserializeTactic } = options.sessions;
  const onError = makeResponder(options.init.onError, 'init.onError');
  const deserializer = deserializeTactic === 'always' ? alwaysDeserializeInit : manualDeserializeInit;

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

  if (options.init.onSuccess) return [initMiddleware, makeResponder(options.init.onSuccess, 'init.onSuccess')];
  return initMiddleware;
};

export default init;
