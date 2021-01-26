import express, { json, urlencoded } from 'express';
import session from 'express-session';
import path from 'path';

import { auth, register } from './models';

const PORT = process.env.PORT || 3020;

// Make express app
const app = express();

// Use ejs to render pages for demonstrative purposes
app.set('views', path.resolve(__dirname, '../ejs'));
app.set('view engine', 'ejs');

// Express body parser middleware
app.use(json({ extended: false }));
app.use(urlencoded({ extended: true }));

// Express session middleware - don't use default sessions in production
app.use(session({
  secret: 'a very secret secret',
  resave: false,
  saveUninitialized: false,
}));

// Initialize hadrian on the request
app.use(auth.init());

// render home page if logged in
app.get('/', auth.checkAuthenticated(), (req, res) => {
  res.render('home', { user: req.user });
});

// render login page if not logged in
app.get('/login', auth.checkUnauthenticated(), (req, res) => res.render('login', { error: null }));

// render register page if not logged in
app.get('/register', auth.checkUnauthenticated(), (req, res) => res.render('register', { error: null }));

// logout if not logged in
app.get('/logout', auth.checkAuthenticated(), auth.logout(), (req, res) => { res.redirect('/login'); });

// if logged out authenticate the user and login
app.post('/login', auth.checkUnauthenticated(), auth.authenticate(), (req, res) => { res.redirect('/'); });

// if logged out register user using authenticate('password_register') and login
app.post('/register', auth.checkUnauthenticated(), register.authenticate(), (req, res) => { res.render('success', { message: 'Registration successful', user: req.user }); });

// listen for requests
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server successfully started on port ${PORT}`);
}).on('error', (error) => {
  // eslint-disable-next-line no-console
  console.log('Error on server startup');
  throw error;
});
