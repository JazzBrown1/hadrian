# Hadrian
> Fast and versatile authentication middleware for Express.js.

![npm](https://img.shields.io/npm/v/hadrian)
[![GitHub license](https://img.shields.io/github/license/JazzBrown1/hadrian)](https://github.com/JazzBrown1/hadrian/blob/master/LICENCE.txt)
![Travis (.com)](https://img.shields.io/travis/com/JazzBrown1/hadrian)
![Coveralls github](https://img.shields.io/coveralls/github/JazzBrown1/hadrian)
![npm bundle size](https://img.shields.io/bundlephobia/min/hadrian)
![GitHub last commit](https://img.shields.io/github/last-commit/JazzBrown1/hadrian)

Hadrian is a flexible and dynamic authentication middleware for express.js. It has been designed to be easy to use, modular, unopinionated and take the complexities out of building authentication into server apps.

Hadrian simplifies authentication in express apps, removing unnecessary complexities while maintaining full flexibility to create and support any type of authentication strategy.

Hadrian is Quick! By preprocessing the authentication models at time of start up, Hadrian is able to handle requests with maximum efficiency.

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

Create a new Model instance by calling new Model(options)

You can provide a function for each of the authentication steps:

- extract - async (req) => query

- getUser - async (query, req) => user

- verify - async (query, user, req) => result

```javascript
import { Model, Fail } from 'hadrian';

import { findUserByUserName } from './db';

const auth = new Model({
  name: 'password',
  authenticate: {
    extract: (req) => req.body,
    getUser: async (query) => findUserByUserName(query.username),
    verify: (query, data) => query.password && query.password === data.password
  },
  sessions: {
    useSessions: true,
    serialize: (deserializedUser) => deserializedUser.username,
    deserialize: (serializedUser) => findUserByUsername(serializedUser)
  }
});
```

The init() middleware must be called before any other authentication middleware and after parsing and sessions middleware(If sessions are required).

```javascript
app.use(json({ extended: false }));
app.use(
  session({
    secret: 'a very secret secret',
    resave: false,
    saveUninitialized: false
  }),
);

app.use(auth.init());
```

Use the authenticate() middleware to authenticate a client.

```javascript
app.use('/login', auth.checkUnauthenticated(), auth.authenticate(), (req, res) => {
  res.redirect('/home');
});
```

You can limit access to routes by using the checkAuthenticated() or checkUnauthenticated() middleware.

```javascript
app.use('/api/private/', auth.checkAuthenticated({ onFail: { redirect: '/login' } }), privateApiRoutes);
```

You can also set default handlers when creating the Authentication model.

```javascript
const auth = new Model({
  //............
  checkAuthenticated: {
    onFail: { redirect: '/login' }
  },
  checkUnauthenticated: {
    onFail: (req, res) => res.redirect('/home')
  }
})
 ```

You can use multiple authentication models in your app.

```javascript
app.post(
  '/loginAuthOne',
  authOne.checkUnauthenticated({ by: 'self' }),
  authOne.authenticate()
);

app.post(
  '/loginAuthTwo',
  authTwo.checkUnauthenticated({ by: 'any' }),
  authTwo.authenticate()
);

app.post(
  'logoutAll',
  authOne.logout({ of: 'all' })
);

app.post(
  'logoutAuthOne',
  authOne.logout({ of: 'self' })
);

//......
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
