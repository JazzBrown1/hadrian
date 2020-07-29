
import { defineModel, Fail } from 'hadrian';
import { findUserByUserName } from './db';


defineModel(
  'password', // Authentication model name <optional> name prop in options is fine
  { // Authentication Model Options
    authenticate: {
      extract: 'body', // this will extract req.body for the query can pass a function here (req, done) => done(error, query);
      getData: async (query) => {
        const user = await findUserByUserName(query.username);
        if (!user) throw new Fail('Unknown User');
        return user;
      },
      verify: (query, user) => user.password && query.password === user.password,
      onFail: (req, res) => res.render('login', { error: 'Password or username did not match! Try again' }), // Accepts a response object or response function
      onSuccess: { redirect: '/' }, // equivalent to "(req, res) => res.redirect('/')"
    },
    sessions: {
      deserializeTactic: 'never', // req.user is an async function that only deserializes user when required
      useSessions: true,
      serialize: (user) => user.username, // don't save passwords in sessions
      deserialize: (username) => findUserByUserName(username),
    },
    logout: {
      onSuccess: { redirect: '/login' }
    },
    checkAuthenticated: {
      onFail: (req, res) => res.redirect('/login')
    },
    checkUnauthenticated: {
      onFail: { redirect: '/' }
    },
  },
  true // Set as default <optional> defaults to false
);
