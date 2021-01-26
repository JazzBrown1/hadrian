import express, { urlencoded } from 'express';
import session from 'express-session';

import auth from './password.model';

const PORT = 3030;

// Hadrian methods are tightly bounded so you can deconstruct your Auth object.
const {
  authenticate, checkAuthenticated, checkUnauthenticated, init, logout
} = auth;

// Make express app
const app = express();

// Use ejs to render pages for demonstrative purposes
app.set('views', `${__dirname}/../ejs`);
app.set('view engine', 'ejs');

// Express body parser middleware
app.use(urlencoded({ extended: true }));

// Express session middleware - don't use default sessions in production
app.use(session({
  secret: 'a very secret secret',
  resave: false,
  saveUninitialized: false,
}));

// Initialize hadrian on the request
app.use(init());

// render home page if logged in
app.get('/', checkAuthenticated(), (req, res) => { res.render('home', { user: req.user }); });

// render login page if not logged in
app.get('/login', checkUnauthenticated(), (req, res) => res.render('login', { error: null }));

// logout if not logged in
app.get('/logout', checkAuthenticated(), logout(), (req, res) => res.render('login', { error: null }));

// if logged out authenticate the user and login
app.post('/login', checkUnauthenticated(), authenticate(), (req, res) => { res.render('home', { user: req.user }); });

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
