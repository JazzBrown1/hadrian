/* eslint-disable func-names */

import init from './middleware/init';
import authenticate from './middleware/authenticate';
import { checkAuthenticated, checkUnauthenticated } from './middleware/checkAuthenticated';
import logout from './middleware/logout';
import optionsSchema from './options/optionsSchema';

const Options = require('ez-options');

const copy = (options, overrides) => options.copy().merge(overrides);

const parseOptions = (options) => {
  if (typeof options !== 'object'
    || Array.isArray(options)) throw new Error('options argument must be an object');
};

const Model = function (options) {
  parseOptions(options);
  this.options = new Options(optionsSchema);
  this.options.merge(options);
  this.init = function (overrides) {
    return init(copy(this.options, overrides && { init: overrides }));
  }.bind(this);
  this.authenticate = function (overrides) {
    return authenticate(copy(this.options, overrides && { authenticate: overrides }));
  }.bind(this);
  this.checkAuthenticated = function (overrides) {
    return checkAuthenticated(copy(this.options, overrides && { checkAuthenticated: overrides }));
  }.bind(this);
  this.checkUnauthenticated = function (overrides) {
    return checkUnauthenticated(
      copy(this.options, overrides && { checkUnauthenticated: overrides })
    );
  }.bind(this);
  this.logout = function (overrides) {
    return logout(copy(this.options, overrides && { logout: overrides }));
  }.bind(this);
};

export default Model;
