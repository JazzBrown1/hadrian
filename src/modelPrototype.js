/* eslint-disable func-names */

import init from './middleware/init';
import authenticate from './middleware/authenticate';
import { checkAuthenticated, checkUnauthenticated } from './middleware/checkAuthenticated';
import logout from './middleware/logout';
import defineModel from './misc/defineModel';
import deserializeUser from './middleware/deserializeUser';

const Model = function (options, name) {
  this.name = name || options.name;
  defineModel(this.name, options);
  this.options = options;
  this.init = function (overrides) {
    return init(this.name, overrides);
  }.bind(this);
  this.authenticate = function (overrides) {
    return authenticate(this.name, overrides);
  }.bind(this);
  this.checkAuthenticated = function (overrides) {
    return checkAuthenticated(this.name, overrides);
  }.bind(this);
  this.checkUnauthenticated = function (overrides) {
    return checkUnauthenticated(this.name, overrides);
  }.bind(this);
  this.logout = function (overrides) {
    return logout(this.name, overrides);
  }.bind(this);
};

export default Model;
