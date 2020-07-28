# Hadrian V2.0.0-alpha
> Fast and versatile authentication middleware for Express.js.

## WARNING! This readme is out of date

[![Version][npm-version]][npm-url]
[![Dependencies][npm-dependencies]][npm-url]
[![Coverage Status](https://coveralls.io/repos/github/JazzBrown1/hadrian/badge.svg?branch=master)](https://coveralls.io/github/JazzBrown1/hadrian?branch=master)
[![Build Status](https://travis-ci.com/JazzBrown1/hadrian.svg?branch=master)](https://travis-ci.com/JazzBrown1/hadrian)

Hadrian is a flexible and dynamic authentication middleware for express.js. It has been designed to be easy to use, modular, unopinionated and take the complexities out of building authentication into server apps.

Hadrian aims to add a very low level abstraction for autentication in express apps, removing unneccasarry complexities while maintaing full flexibility to create and support any type of authentication strategy.

Hadrian is Quick! By preprocessing the authentication models at time of start up, Hadrian is able to handle requests with maximum efficency.

As of version 2 the API has full async support and call callback functions have been removed. This is inline with the upcoming Express 5x release.

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

Use the defineModel function to define an Authentication Model

You can provide a function for each of the authentication steps:

- extract - (req) => query

- getData - (query) => data

- verify - (query, data) => result

- setUser - (creds, data, result) => user

The model can use sync or async functions.

Proposed...
```sh
defineModel(
  {
    name: 'password',
    authenticate: {
      extract: 'body',
      getData: (query) => db.findUserByUsername(query.username),
      verify: (query, data) => query.password === data.password,
      setUser: (query, data) => data,
    },
    sessions: {
      useSessions: true,
      serialize: (deserializedUser) => deserialziedUser.username,
      deserialize: (serializedUser) => findUserByUsername(serialziedUser)
    }
  },
  true
);
```

The second argument will set this model to default (meaning it will not have to be referenced in the middleware).


The init() middleware must be called if at the start of the request straight after any session and parsing middleware.

```sh
app.use(json({ extended: false }));
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
```

You can block access to routes by using the checkAuthenticated() or checkUnauthenticated() middleware.

```sh
app.use('/api/private/', checkAuthenticated({ onFail: { redirect: '/login' } }), privateApiRoutes);
```

You can set default onFail handlers in the Authenitcation model.

```sh
{
  //............
  checkAuthenticated: {
    onFail: { redirect: '/login' }
  },
  checkUnauthenticated: {
    onFail: (req, res) => res.redirect('/home')
  }
}
 ```

In the above example we redirect the user using the hadrian shorthand and the equivelent express api.

You can use multiple authentication models in your app.

When using multiple auth models, it is reccomended that you do not set a default model and explicity pass the model name as the first arguement in all hadrian middleware.

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
