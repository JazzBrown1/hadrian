
import { defineModel } from 'hadrian';
import { findUserByUserName } from './db';
import { Fail } from 'hadrian';

defineModel(
  'password', // Authentication model name <optional> name prop in options is fine
  { // Authentication Model Options
    extract: 'body', // this will extract req.body for the query can pass a function here (req, done) => done(error, query);
    getUser: async (query) => {
      const user = await findUserByUserName(query.username);
      if(!user) throw new Fail('Unknown User');
      return user;
    },
    verify: (query, user) => query.password === user.password,
    serialize: (user) => user.username, // don't save passwords in sessions
    deserialize: (username) => findUserByUserName(username),
    authenticateOnFail: (req, res) => res.render('login', { error: 'Password or username did not match! Try again' }), // Accepts a response object or response function
    authenticateOnSuccess: { redirect: '/'}, // equivalent to "(req, res) => res.redirect('/')"
    logoutOnSuccess: { redirect: '/login' },
    checkAuthenticatedOnFail: (req, res) => res.redirect('/login'),
    checkUnauthenticatedOnFail: { redirect: '/' },
    deserializeTactic: 'never', // req.user is an async function that only deserializes user when required
    useSessions: true
  },
  true // Set as default <optional> defaults to false
);
