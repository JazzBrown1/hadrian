import makeResponder from '../constructors/makeResponder';

const logoutOfAll = (req, res, next) => {
  delete req.user;
  req.hadrian = {
    isAuthenticated: false,
    auth: {}
  };
  req.session.hadrian = req.hadrian;
  next();
};

const logoutOfSelf = (name) => (req, res, next) => {
  if (Object.keys(req.hadrian.auth).length <= 1) {
    delete req.user;
    req.hadrian = {
      isAuthenticated: false,
      auth: {}
    };
  } else {
    delete req.hadrian.auth[name];
  }
  req.session.hadrian = req.hadrian;
  next();
};

const logout = (options) => {
  if (!options.sessions.useSessions) throw new Error('Cannot use Logout middleware when [Options].sessions.useSessions set false');
  const logoutMiddleware = options.logout.of === 'all' ? logoutOfAll : logoutOfSelf(options.name);
  if (options.logout.onSuccess) return [logoutMiddleware, makeResponder(options.logout.onSuccess, 'logoutOnSuccess')];
  return logoutMiddleware;
};

export default logout;
