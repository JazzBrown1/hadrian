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

export default makeDefaults;
