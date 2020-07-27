import makeExtractor from '../options/makeExtractor';
import makeResponder from '../options/makeResponder';
import buildOptions from '../options/buildOptions';
import saveSession from './saveSession';
import init from './init';
import { alwaysDeserializeAuth, manualDeserializeAuth } from '../options/deserializers';

const defaultFailed = 'Failed to verify';

const authenticate = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const options = buildOptions(modelName, overrides, 'authenticate');
  const {
    verify, getUser, clientType, name
  } = options;
  const extract = makeExtractor(options.extract);
  const onError = makeResponder(options.authenticateOnError, 'authenticateOnError');
  const onFail = makeResponder(options.authenticateOnFail, 'authenticateOnFail');
  const deserializer = options.deserializeTactic === 'always' ? alwaysDeserializeAuth : manualDeserializeAuth;

  const authFunction = (req, res, next) => {
    extract(req, (error0, query, reason) => {
      if (error0) return onError(req, res, error0);
      if (!query) return onFail(req, res, reason || defaultFailed);
      getUser(query, (error1, user, reason1) => {
        if (error1) return onError(req, res, error1);
        if (!user) return onFail(req, res, reason1 || defaultFailed);
        verify(query, user, (error2, result, reason2) => {
          if (error2) return onError(req, res, error2);
          if (!result) return onFail(req, res, reason2 || defaultFailed);
          req.hadrian.auth[name] = {
            clientType, query, model: name, result
          };
          req.hadrian.isAuthenticated = true;
          req.deserializedUser = user;
          req.user = deserializer(user, req);
          next();
        }, req);
      }, req);
    });
  };

  const middleware = [];
  if (options.selfInit) middleware.push(init(options));
  middleware.push(authFunction);
  if (options.useSessions) middleware.push(saveSession(options));
  if (options.authenticateOnSuccess) middleware.push(makeResponder(options.authenticateOnSuccess, 'authenticateOnSuccess'));
  return middleware.length === 1 ? authFunction : middleware;
};

export default authenticate;
