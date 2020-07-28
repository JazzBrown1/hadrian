'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const defaultError = (r, rr, n, e) => n(e || new Error('Server Error'));
const defaultFail = { sendStatus: 401 };

const makeDefaults = () => ({
  name: '_default',
  clientType: 'client',
  sessions: {
    useSessions: false,
    deserializeTactic: 'always',
    serialize: (user) => user,
    deserialize: (user) => user,
  },
  authenticate: {
    extract: 'body',
    getData: () => ({}),
    verify: () => true,
    setUser: (q, data) => data,
    onError: defaultError,
    onFail: defaultFail,
    onSuccess: null,
    selfInit: false,
  },
  init: {
    onError: defaultError,
    onSuccess: null,
  },
  checkAuthenticated: {
    onFail: defaultFail,
    onSuccess: null
  },
  checkUnauthenticated: {
    onFail: defaultFail,
    onSuccess: null
  },
  logout: {
    onSuccess: null
  },
  deserializeUser: {
    onError: defaultError,
    onSuccess: null
  }
});

const models = {
  _default: makeDefaults()
};

const isObj = (x) => typeof x === 'object' && x !== null && !Array.isArray(x);

const merge = (a, b, i = 0) => {
  Object.keys(b).forEach((key) => {
    if (a[key] === undefined) throw new Error(`Unknown option ${key}`);
    if (isObj(a[key]) && isObj(b[key]) && i > 0) merge(a[key], b[key], i - 1);
    else a[key] = b[key];
  });
  return a;
};

const defineModel = (model, options, isDefault) => {
  if (typeof model === 'object') {
    isDefault = options;
    options = model;
    if (!options.name) throw new Error('Model must have a name');
    model = model.name;
  }
  // First model defined is always set to default unless explicitly set to false
  if (models.length < 2 && isDefault !== false) isDefault = true;

  models[model] = merge(makeDefaults(), options, 1);
  models[model].name = model; // name overridden by model name if specified
  models[model].isDefault = isDefault; // is default cannot be declared in options obj by design
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

const getOptionsObject = (modelName) => {
  if (modelName && !models[modelName]) throw new Error('model is not set');
  return models[modelName || '_default'];
};

const parseOptions = (options) => {
  if (typeof options.authenticate.verify !== 'function') throw new Error('verify must be a function');
  if (typeof options.authenticate.getData !== 'function') throw new Error('getUser must be a function');
  return options;
};

const buildOptions2 = (modelName, overrides, prefix) => {
  const options = { ...getOptionsObject(modelName) };
  options[prefix] = { ...options[prefix], ...overrides };
  parseOptions(options);
  return options;
};

const saveSession = (options, onError) => {
  const { serialize } = options.sessions;
  return (req, res, next) => {
    const run = async () => {
      const serializedUser = await serialize(req.deserializedUser);
      req.hadrian.user = serializedUser;
      req.session.hadrian = req.hadrian;
      next();
    };
    run().catch((err) => onError(req, res, next, err));
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
  if (options.init.onSuccess) {
    const onSuccess = makeResponder(options.init.onSuccess, 'init.onSuccess');
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
  const options = buildOptions2(modelName, overrides, 'init');

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

const authenticate = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const options = buildOptions2(modelName, overrides, 'authenticate');
  const { clientType, name } = options;
  const {
    verify, getData, setUser
  } = options.authenticate;
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
      if (err.isFail) return onFail(req, res, next, err);
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

/* eslint-disable max-len */

const checkUnauthenticated = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const options = buildOptions2(modelName, overrides, 'checkUnauthenticated').checkUnauthenticated;
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
  const options = buildOptions2(modelName, overrides, 'checkAuthenticated').checkAuthenticated;
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

const logout = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const options = buildOptions2(modelName, overrides, 'logout');
  if (!options.sessions.useSessions) throw new Error('Cannot use Logout middleware when use sessions set false in model');
  const logoutMiddleware = (req, res, next) => {
    delete req.user;
    req.hadrian = {
      isAuthenticated: false,
      auth: {}
    };
    req.session.hadrian = req.hadrian;
    next();
  };
  if (options.logout.onSuccess) return [logoutMiddleware, makeResponder(options.logout.onSuccess, 'logoutOnSuccess')];
  return logoutMiddleware;
};

const deserializeUser = (modelName, overrides) => {
  if (typeof modelName === 'object') {
    overrides = modelName;
    modelName = null;
  }
  const { onError: onErrorRaw, onSuccess } = buildOptions2(modelName, overrides, 'deserializeUser').deserializeUser;
  const onError = makeResponder(onErrorRaw, 'deserializeUserOnError');
  const deserializeMiddleware = (req, res, next) => {
    if (!req.user) return next();
    req.user().then(() => { next(); }).catch((err) => { onError(req, res, next, err); });
  };
  if (onSuccess) return [deserializeMiddleware, makeResponder(onSuccess, 'deserializeUser.onSuccess')];
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
