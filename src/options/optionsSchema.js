const useExpressErrorHandler = (r, rr, next, err) => next(err || new Error('Server Error'));
const send401 = { sendStatus: 401 };
const _property = true;
const _parent = true;

const schema = {
  name: { _property, types: ['string'], default: '_default' },
  clientType: { _property, types: ['string'], default: 'client' },
  sessions: {
    _parent,
    useSessions: { _property, types: ['boolean'], default: false },
    deserializeTactic: { _property, enum: ['always', 'never', 'manual'], default: 'always' }, // enums in next ez-options release
    serialize: { _property, types: ['function'], default: (user) => user },
    deserialize: { _property, types: ['function'], default: (user) => user },
  },
  authenticate: {
    _parent,
    extract: { _property, types: ['string', 'function'], default: 'body' },
    getData: { _property, types: ['function'], default: () => ({}) },
    verify: { _property, types: ['function'], default: () => true },
    setUser: { _property, types: ['function'], default: (q, data) => data },
    onError: { _property, types: ['function', 'object'], default: useExpressErrorHandler },
    onFail: { _property, types: ['function', 'object'], default: send401 },
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
    selfInit: { _property, types: ['boolean'], default: false },
  },
  init: {
    _parent,
    onError: { _property, types: ['function', 'object'], default: useExpressErrorHandler },
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
  },
  checkAuthenticated: {
    _parent,
    onFail: { _property, types: ['function', 'object'], default: send401 },
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
    by: { _property, enum: ['any', 'self'], default: 'any' }
  },
  checkUnauthenticated: {
    _parent,
    onFail: { _property, types: ['function', 'object'], default: send401 },
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
    by: { _property, enum: ['any', 'self'], default: 'self' }
  },
  checkAuthentication: {
    _parent,
    onFail: { _property, types: ['function', 'object'], default: send401 },
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
    by: { _property, enum: ['any', 'self'], default: 'self' },
    check: { _property, types: ['null', 'function'], default: null },
    is: { _property, types: ['boolean'], default: true }
  },
  logout: {
    _parent,
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
    of: { _property, enum: ['all', 'self'], default: 'self' },
  }
};

export default schema;
