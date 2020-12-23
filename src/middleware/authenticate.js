import makeExtractor from '../constructors/makeExtractor';
import makeResponder from '../constructors/makeResponder';
import saveSession from './saveSession';
import init from './init';
import { alwaysDeserializeAuth, manualDeserializeAuth } from '../misc/deserializers';

const authenticate = (options) => {
  const { clientType, name } = options;
  const {
    verify, setUser
  } = options.authenticate;
  const getData = options.authenticate.getUser || options.authenticate.getData;
  const extract = makeExtractor(options.authenticate.extract);
  const onError = makeResponder(options.authenticate.onError, 'authenticate.onError');
  const onFail = makeResponder(options.authenticate.onFail, 'authenticate.onFail');
  const deserializer = options.sessions.deserializeTactic === 'always' ? alwaysDeserializeAuth : manualDeserializeAuth;

  const authFunction = (req, res, next) => {
    const run = async () => {
      const query = await extract(req);
      const data = await getData(query, req);
      const result = await verify(query, data, req);
      if (!result) return onFail(req, res, next);
      const user = await setUser(query, data, req);
      req.hadrian.auth[name] = {
        clientType, query, model: name, result
      };
      req.hadrian.isAuthenticated = true;
      req.deserializedUser = user;
      req.user = deserializer(user, req);
      next();
    };
    run().catch((err) => {
      if (err.isFail) return onFail(req, res, next, err, err.reason);
      onError(req, res, next, err);
    });
  };

  const middleware = [];
  if (options.authenticate.selfInit) middleware.push(init(options));
  middleware.push(authFunction);
  if (options.sessions.useSessions) middleware.push(saveSession(options, onError));
  if (options.authenticate.onSuccess) middleware.push(makeResponder(options.authenticate.onSuccess, 'authenticate.onSuccess'));
  return middleware.length === 1 ? authFunction : middleware;
};

export default authenticate;
