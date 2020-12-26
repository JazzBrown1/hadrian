/* eslint-disable func-names */

import init from './middleware/init';
import authenticate from './middleware/authenticate';
import { checkAuthenticated, checkUnauthenticated, checkAuthentication } from './middleware/checkAuthentication';
import logout from './middleware/logout';
import optionsSchema from './options/optionsSchema';

const Options = require('ez-options');

const copy = (options, overrides) => (overrides ? options.copy().merge(overrides) : options.copy());

const parseOptions = (options) => {
  if (typeof options !== 'object'
    || Array.isArray(options)) throw new Error('options argument must be an object');
};

const optionsConfig = { dieHard: process.env.NODE_ENV === 'production' };

const Model = function (options) {
  parseOptions(options);
  this.options = new Options(optionsSchema, optionsConfig);
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
  this.checkAuthentication = function (overrides) {
    return checkAuthentication(copy(this.options, overrides && { checkAuthentication: overrides }));
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
