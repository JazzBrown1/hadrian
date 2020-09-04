import makeResponder from '../constructors/makeResponder';

const logout = (options) => {
  if (!options.sessions.useSessions) throw new Error('Cannot use Logout middleware when use sessions set false in model');
  const logoutMiddleware = (req, res, next) => {
    delete req.user;
    req.hadrian = {
      isAuthenticated: false,
      auth: {}
    };
    req.session.hadrian = req.hadrian;
    next();
  };
  if (options.logout.onSuccess) return [logoutMiddleware, makeResponder(options.logout.onSuccess, 'logoutOnSuccess')];
  return logoutMiddleware;
};

export default logout;
