'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const defaultError = async (r, rr, n, e) => n(e || new Error('Server Error'));

const makeDefaults = () => ({
  name: 'default',
  useSessions: false,
  deserializeTactic: 'always',
  clientType: 'client',
  selfInit: false,
  extract: 'body',
  getUser: async () => ({}),
  verify: async () => true,
  serialize: async (user) => user,
  deserialize: async (user) => user,
  initOnError: defaultError,
  initOnSuccess: null,
  authenticateOnError: defaultError,
  authenticateOnFail: { status: 401 },
  authenticateOnSuccess: null,
  checkAuthenticationOnFail: { status: 401 },
  checkAuthenticationOnSuccess: null,
  checkAuthenticatedOnFail: { status: 401 },
  checkAuthenticatedOnSuccess: null,
  checkUnauthenticatedOnFail: { status: 401 },
  checkUnauthenticatedOnSuccess: null,
  logoutOnSuccess: null,
  deserializeUserOnError: defaultError,
  serializeUserOnError: defaultError,
  deserializeUserOnSuccess: null
});

const models = {
  _default: makeDefaults()
};

const defineModel = (model, options, isDefault) => {
  if (typeof model === 'object') {
    isDefault = options;
    options = model;
    if (!options.name) throw new Error('Model must have a name');
    model = model.name;
  }
  models[model] = { ...makeDefaults(), ...options };
  models[model].name = model;
  models[model].isDefault = isDefault; // is default cannot be declared in options obj
  if (isDefault) {
    models._default = models[model];
  }
};

const modifyModel = (model, options) => {
  if (!models[model]) throw new Error('Cannot modifyModel a model that is not set');
  const { isDefault } = models[model];
  Object.assign(models[model], options);
  models[model].isDefault = isDefault; // cannot overwrite default
};

const makeExtractor = (extract) => (typeof extract === 'function' ? extract : (req) => req[extract]);

const redirectEnd = (redirect, status) => (status
  ? (req, res) => res.status(status).redirect(redirect)
  : (req, res) => res.redirect(redirect)
);
const sendEnd = (data, status) => (status
  ? (req, res) => res.status(status).send(data)
  : (req, res) => res.send(data)
);
const jsonEnd = (json, status) => (status
  ? (req, res) => res.status(status).json(json)
  : (req, res) => res.json(json)
);
const renderEnd = (view, status, renderData = {}) => (status
  ? (req, res) => res.status(status).render(view, renderData)
  : (req, res) => res.render(view, renderData)
);
const statusEnd = (status) => (req, res) => res.sendStatus(status);

const makeResponder = (end, type) => {
  if (typeof end === 'function') return end;
  if (typeof end !== 'object') throw new Error(`Invalid ${type} input, type ${typeof end} - ${end}`);
  if (end.redirect) return redirectEnd(end.redirect, end.status);
  if (end.send) return sendEnd(end.send, end.status);
  if (end.json) return jsonEnd(end.json, end.status);
  if (end.render) return renderEnd(end.render, end.status, end.renderData);
  if (end.status) return statusEnd(end.status);
  if (end.sendStatus) return statusEnd(end.sendStatus);
  throw new Error(`Invalid ${type} input`);
};

const addEventsToOptions = (options, prefix) => {
  if (options.onFail) options[`${prefix}OnFail`] = options.onFail;
  if (options.onError) options[`${prefix}OnError`] = options.onError;
  if (options.onSuccess) options[`${prefix}OnSuccess`] = options.onSuccess;
  return options;
};

const makeOptionsObject = (modelName, overrides) => {
  if (modelName && !models[modelName]) throw new Error('model is not set');
  return { ...models[modelName || '_default'], ...overrides };
};

const parseOptions = (options) => {
  if (typeof options.verify !== 'function') throw new Error('verify must be a function');
  if (typeof options.getUser !== 'function') throw new Error('getUser must be a function');
  return options;
};

const buildOptions = (modelName, overrides, prefix) => {
  const options = makeOptionsObject(modelName, overrides);
  addEventsToOptions(options, prefix);
  parseOptions(options);
  return options;
};

const saveSession = (overrides) => {
  const { serialize, serializeOnError } = overrides;
  return (req, res, next) => {
    const run = async () => {
      const serializedUser = await serialize(req.deserializedUser);
      req.hadrian.user = serializedUser;
      req.session.hadrian = req.hadrian;
      next();
    };
    run().catch((err) => serializeOnError(req, res, next, err));
  };
};

const manualDeserializeInit = async (s, deserialize) => async function getUser() {
  if (this.deserializedUser) return this.deserializedUser;
  const deserializedUser = deserialize(this.hadrian.user);
  this.deserializedUser = deserializedUser;
  return deserializedUser;
};

const manualDeserializeAuth = () => function getUser() {
  return Promise.resolve(this.deserializedUser);
};

const alwaysDeserializeInit = async (serializedUser, deserialize, req) => {
  const user = await deserialize(serializedUser);
  req.deserializedUser = user;
  return user;
};

const alwaysDeserializeAuth = (deserializedUser) => deserializedUser;

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
  if (options.useSessions) middleware.push(saveSession(options));
  if (options.authenticateOnSuccess) middleware.push(makeResponder(options.authenticateOnSuccess, 'authenticateOnSuccess'));
  return middleware.length === 1 ? authFunction : middleware;
};

const checkAuthenticatedBasic = (modelName, overrides, wrapperName) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const onFailOption = `${wrapperName}OnFail`;
  const onSuccessOption = `${wrapperName}OnSuccess`;
  const options = buildOptions(modelName, overrides, wrapperName);
  const onFail = makeResponder(options[onFailOption], onFailOption);
  if (!options[onSuccessOption]) {
    return (req, res, next) => {
      if (req.hadrian.isAuthenticated) return next();
      onFail(req, res);
    };
  }
  const onSuccess = makeResponder(options[onSuccessOption], onSuccessOption);
  return (req, res, next) => {
    if (req.hadrian.isAuthenticated) return onSuccess(req, res, next);
    onFail(req, res);
  };
};

const checkUnauthenticatedBasic = (modelName, overrides, wrapperName) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const onFailOption = `${wrapperName}OnFail`;
  const onSuccessOption = `${wrapperName}OnSuccess`;
  const options = buildOptions(modelName, overrides, wrapperName);
  const onFail = makeResponder(options[onFailOption], onFailOption);
  if (!options[onSuccessOption]) {
    return (req, res, next) => {
      if (!req.hadrian.isAuthenticated) return next();
      onFail(req, res);
    };
  }
  const onSuccess = makeResponder(options[onSuccessOption], onSuccessOption);
  return (req, res, next) => {
    if (!req.hadrian.isAuthenticated) return onSuccess(req, res, next);
    onFail(req, res);
  };
};

const checkAuthenticated = (s, o) => checkAuthenticatedBasic(s, o, 'checkAuthenticated');
const checkUnauthenticated = (s, o) => checkUnauthenticatedBasic(s, o, 'checkUnauthenticated');

const logout = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const options = buildOptions(modelName, overrides, 'logout');
  if (!options.useSessions) throw new Error('Cannot use Logout middleware when use sessions set false in model');
  const logoutMiddleware = (req, res, next) => {
    delete req.user;
    req.hadrian = {
      isAuthenticated: false,
      auth: {}
    };
    req.session.hadrian = req.hadrian;
    next();
  };
  if (options.logoutOnSuccess) return [logoutMiddleware, makeResponder(options.logoutOnSuccess, 'logoutOnSuccess')];
  return logoutMiddleware;
};

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

class Fail extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = 'ValidationError'; // (2)
    this.reason = message;
    this.isFail = true;
  }
}

exports.Fail = Fail;
exports.authenticate = authenticate;
exports.checkAuthenticated = checkAuthenticated;
exports.checkUnauthenticated = checkUnauthenticated;
exports.defineModel = defineModel;
exports.deserializeUser = deserializeUser;
exports.init = init;
exports.initialize = init;
exports.logout = logout;
exports.models = models;
exports.modifyModel = modifyModel;
