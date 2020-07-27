const defaultError = async (r, rr, n, e) => n(e || new Error('Server Error'));
const defaultFail = { sendStatus: 401 };

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
  authenticateOnFail: defaultFail,
  authenticateOnSuccess: null,
  checkAuthenticationOnFail: defaultFail,
  checkAuthenticationOnSuccess: null,
  checkAuthenticatedOnFail: defaultFail,
  checkAuthenticatedOnSuccess: null,
  checkUnauthenticatedOnFail: defaultFail,
  checkUnauthenticatedOnSuccess: null,
  logoutOnSuccess: null,
  deserializeUserOnError: defaultError,
  deserializeUserOnSuccess: null
});

export default makeDefaults;
