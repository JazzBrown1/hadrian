const useExpressErrorHandler = (r, rr, n, e) => n(e || new Error('Server Error'));
const send401 = { sendStatus: 401 };

const schema = {
  name: { type: ['string'], default: '_default' },
  clientType: { type: ['string'], default: 'client' },
  isDefault: { type: ['boolean', 'undefined'], default: false },
  sessions: {
    type: 'child',
    children: {
      useSessions: { type: ['boolean'], default: false },
      deserializeTactic: { type: ['string'], default: 'always' },
      serialize: { type: ['function'], default: (user) => user },
      deserialize: { type: ['function'], default: (user) => user },
    }
  },
  authenticate: {
    type: 'child',
    children: {
      extract: { type: ['string', 'function'], default: 'body' },
      getData: { type: ['function'], default: () => ({}) },
      verify: { type: ['function'], default: () => true },
      setUser: { type: ['function'], default: (q, data) => data },
      onError: { type: ['null', 'function', 'object'], default: useExpressErrorHandler },
      onFail: { type: ['null', 'function', 'object'], default: send401 },
      onSuccess: { type: ['null', 'function', 'object'], default: null },
      selfInit: { type: ['boolean'], default: false },
    }
  },
  init: {
    type: 'child',
    children: {
      onError: { type: ['null', 'function', 'object'], default: useExpressErrorHandler },
      onSuccess: { type: ['null', 'function', 'object'], default: null },
    }
  },
  checkAuthenticated: {
    type: 'child',
    children: {
      onFail: { type: ['null', 'function', 'object'], default: send401 },
      onSuccess: { type: ['null', 'function', 'object'], default: null }
    }
  },
  checkUnauthenticated: {
    type: 'child',
    children: {
      onFail: { type: ['null', 'function', 'object'], default: send401 },
      onSuccess: { type: ['null', 'function', 'object'], default: null }
    }
  },
  logout: {
    type: 'child',
    children: { onSuccess: { type: ['null', 'function', 'object'], default: null } }
  },
  deserializeUser: {
    type: 'child',
    children: {
      onError: { type: ['null', 'function', 'object'], default: useExpressErrorHandler },
      onSuccess: { type: ['null', 'function', 'object'], default: null }
    }
  }
};

export default schema;
