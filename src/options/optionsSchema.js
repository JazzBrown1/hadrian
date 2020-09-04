const useExpressErrorHandler = (r, rr, n, e) => n(e || new Error('Server Error'));
const send401 = { sendStatus: 401 };
const _property = true;
const _parent = true;

const schema = {
  name: { _property, types: ['string'], default: '_default' },
  clientType: { _property, types: ['string'], default: 'client' },
  sessions: {
    _parent,
    useSessions: { _property, types: ['boolean'], default: false },
    deserializeTactic: { _property, types: ['string'], default: 'always' },
    serialize: { _property, types: ['function'], default: (user) => user },
    deserialize: { _property, types: ['function'], default: (user) => user },
  },
  authenticate: {
    _parent,
    extract: { _property, types: ['string', 'function'], default: 'body' },
    getData: { _property, types: ['function'], default: () => ({}) },
    verify: { _property, types: ['function'], default: () => true },
    setUser: { _property, types: ['function'], default: (q, data) => data },
    onError: { _property, types: ['null', 'function', 'object'], default: useExpressErrorHandler },
    onFail: { _property, types: ['null', 'function', 'object'], default: send401 },
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
    selfInit: { _property, types: ['boolean'], default: false },
  },
  init: {
    _parent,
    onError: { _property, types: ['null', 'function', 'object'], default: useExpressErrorHandler },
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
  },
  checkAuthenticated: {
    _parent,
    onFail: { _property, types: ['null', 'function', 'object'], default: send401 },
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
    by: { _property, enum: ['any', 'self'], default: 'any' } // tbd
  },
  checkUnauthenticated: {
    _parent,
    onFail: { _property, types: ['null', 'function', 'object'], default: send401 },
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
    by: { _property, enum: ['any', 'self'], default: 'any' } // tbd
  },
  logout: {
    _parent,
    onSuccess: { _property, types: ['null', 'function', 'object'], default: null },
    of: { _property, enum: ['all', 'self'], default: 'all' }, // tbd
  }
};

export default schema;
