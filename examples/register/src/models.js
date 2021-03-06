
import { Model, Fail } from 'hadrian';
import hashPassword from 'hash-password';
import { findUserByUserName, insertUser, findUserById } from './db';

// Use hash-password to hash and salt passwords before saving to db
const pw = hashPassword();

const serialize = (user) => user.id;
const deserialize = async (id) => findUserById(id);

const validateRegisterQuery = (query) => {
  if (typeof query.username !== 'string' || query.username.length === 0) {
    throw new Fail('You must specify a username');
  } else if (typeof query.password !== 'string' || query.password.length === 0) {
    throw new Fail('You must specify a password');
  } else if (query.username === query.password) {
    throw new Fail('Your username cannot be the same as your password');
  }
};

const auth = new Model(
  {
    name: 'password',
    authenticate: {
      extract: 'body',
      getUser: async (query) => query.username && findUserByUserName(query.username),
      verify: (query, user) => pw.validate(query.password, user.password),
      onError: (req, res) => res.render('login', { error: 'internal server error' }),
      onFail: (req, res) => res.render('login', { error: 'Password or username did not match! Try again' }),
    },
    sessions: {
      useSessions: true,
      serialize,
      deserialize
    },
    checkAuthenticated: {
      by: 'any',
      onFail: { redirect: '/login' }
    },
    checkUnauthenticated: {
      by: 'any',
      onFail: { redirect: '/' }
    },
    logout: {
      of: 'all'
    }
  }
);

const register = new Model({
  name: 'password_register',
  sessions: {
    useSessions: true,
    serialize,
    deserialize
  },
  authenticate: {
    extract: (req) => {
      const query = req.body;
      validateRegisterQuery(query);
      return query;
    },
    getUser: async (query) => {
      const password = pw.generate(query.password);
      if (await findUserByUserName(query.username)) {
        throw new Fail('Username already registered');
      }
      return insertUser(query.username, password);
    },
    onError: (req, res) => res.render('register', { error: 'internal server error' }),
    onFail: (r, res, n, e, reason) => res.render('register', { error: reason }),
  }
});

export { auth, register };
