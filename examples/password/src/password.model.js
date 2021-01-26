
import { Model } from 'hadrian';
import { findUserByUserName } from './db';

const auth = new Model({
  name: 'password',
  authenticate: {
    extract: 'body',
    getUser: (query) => findUserByUserName(query.username),
    verify: (query, user) => user.password && query.password === user.password,
    onFail: (req, res) => res.render('login', { error: 'Password or username did not match! Try again' })
  },
  sessions: {
    useSessions: true,
    serialize: (user) => user.username,
    deserialize: (username) => findUserByUserName(username),
  },
  checkAuthenticated: {
    onFail: (req, res) => res.redirect('/login')
  },
  checkUnauthenticated: {
    onFail: (req, res) => res.redirect('/')
  },
});

export default auth;
