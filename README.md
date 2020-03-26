# Hadrian
> Fast and versatile authentication middleware for Express.js.

[![Version][npm-version]][npm-url]
[![Dependencies][npm-dependencies]][npm-url]
[![Coverage Status](https://coveralls.io/repos/github/JazzBrown1/hadrian/badge.svg?branch=master)](https://coveralls.io/github/JazzBrown1/hadrian?branch=master)
[![Build Status](https://travis-ci.com/JazzBrown1/hadrian.svg?branch=master)](https://travis-ci.com/JazzBrown1/hadrian)

Hadrian is a flexible and dynamic authentication middleware for express.js. It has been designed to be easy to use, modular, unopinionated and take the complexities out of building authentication into server apps.

Hadrian speeds up and simplifies the process of adding authentication layers to express apps; by allowing you to declare authentication model in a friendly schema, you can quickly add or improve authentication in your app.

## Installation

Ensure you have installed Express.js

```sh
$ npm install express
```

Install hadrian

```sh
$ npm install hadrian
```

## Usage

Use the defineModel function to define an Authentication Model.

```sh
defineModel(
  'password',
  {
    extract: 'body',
    useSessions: true,
    getUser: (query, done) => db.findUserByUsername(query.username, done),
    verify: (query, user, done) => done(null, query.password === user.password)
  },
  true
);
```

The first argument is the model name. The second the model options. And the third argument is whether to set this model to default (meaning it will not have to be referenced in the middleware). If the third argument is ommiad it defaults to false.

Authentication Model Defaults:

```sh
{
  // Authentication Logic
  useSessions: false,
  deserializeTactic: 'always',
  selfInit: false,
  clientType: 'client',
  extract: 'body',
  getUser: (extract, done) => done(null, {}),
  verify: (extract, user, done) => done(null, true),
  serialize: (user, done) => done(null, user),
  deserialize: (user, done) => done(null, user),
  // Response Logic
  initOnError: { status: 500 },
  initOnSuccess: null,
  authenticateOnError: { status: 500 },
  authenticateOnFail: { status: 401 },
  authenticateOnSuccess: null,
  checkAuthenticatedOnFail: { status: 401 },
  checkAuthenticatedOnSuccess: null,
  checkUnauthenticatedOnFail: { status: 401 },
  checkUnauthenticatedOnSuccess: null,
  logoutOnSuccess: null,
  deserializeUserOnError: { status: 500 },
  deserializeUserOnSuccess: null
}
```

The init() middleware must be called if at the start of the request straight after any session and parsing middleware.

```sh
app.use(json({ extended: false }));
app.use(urlencoded({ extended: true }));
app.use(
  session({
    secret: 'a very secret secret',
    resave: false,
    saveUninitialized: false
  }),
);

app.use(init());
```

Use the authenticate() middleware to authenticate a client.

```sh
app.use('/login', checkUnauthenticated(), authenticate(), (req, res) => {
  res.redirect('/home');
});

// Or pass the onSuccess response in the authentication middleware options

app.use('/login', checkUnauthenticated(), authenticate({ onSuccess: { redirect: '/home' } }));
```

You can block routes by using the checkAuthenticated() or checkUnauthenticated() middleware.

```sh
app.use('/api/private/', checkAuthenticated(), privateApiRoutes);
```

Sometimes you may need different fail, error or success responses to those set in the Authentication Model, for example this api expects a json response.

```sh
const overrides = {
  onFail: { json: { error: 'You must be logged in to get the date' } },
  onError: { json: { error: 'Internal server error' } },
};

app.get('/api/private/', checkAuthenticated(overrides), privateApiRoutes);
```

You can use multiple authentication models in your app.

When you want to use a Model that is not set to default, pass the model name as the first argument to the middleware.

```sh
app.post(
  '/login',
  checkUnauthenticated('oauth-2'),
  authenticate('oauth-2', {
    onError:{ send: 'Error!' }
  }),
  (req, res) => {
    res.redirect('home');
  }
);
```

_For working examples and usage, please refer to the [examples section on project Github](https://github.com/JazzBrown1/hadrian/tree/master/examples/)_

## Meta

Jazz Brown – jazzbrown200@gmail.com

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/jazzbrown1/hadrian](https://github.com/JazzBrown1/hadrian)

## Contributing

1. Fork it (<https://github.com/jazzbrown1/hadrian/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img urls -->
[npm-version]: https://img.shields.io/npm/v/hadrian
[npm-dependencies]: https://img.shields.io/david/jazzbrown1/hadrian
[npm-downloads]: https://img.shields.io/npm/dm/hadrian
[npm-url]: https://npmjs.org/hadrian/
