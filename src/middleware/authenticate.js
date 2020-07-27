import makeExtractor from '../options/makeExtractor';
import makeResponder from '../options/makeResponder';
import buildOptions from '../options/buildOptions';
import saveSession from './saveSession';
import init from './init';
import { alwaysDeserializeAuth, manualDeserializeAuth } from '../options/deserializers';

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
    const run = async () => {
      const query = await extract(req);
      const user = await getUser(query, req);
      const result = await verify(query, user, req);
      if (!result) return onFail(req, res, next);
      req.hadrian.auth[name] = {
        clientType, query, model: name, result
      };
      req.hadrian.isAuthenticated = true;
      req.deserializedUser = user;
      req.user = deserializer(user, req);
      next();
    };
    run().catch((err) => {
      if (err.isFail) return onFail(req, res, next, err);
      onError(req, res, next, err);
    });
  };

  const middleware = [];
  if (options.selfInit) middleware.push(init(options));
  middleware.push(authFunction);
  if (options.useSessions) middleware.push(saveSession(options, onError));
  if (options.authenticateOnSuccess) middleware.push(makeResponder(options.authenticateOnSuccess, 'authenticateOnSuccess'));
  return middleware.length === 1 ? authFunction : middleware;
};

export default authenticate;
