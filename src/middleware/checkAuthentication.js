import makeResponder from '../constructors/makeResponder';

const checkSelf = (name) => (req) => Boolean(req.hadrian.auth[name]);
const checkAny = (req) => Object.keys(req.hadrian.auth).length;

const checkAuthentication = (options) => {
  // eslint-disable-next-line no-nested-ternary
  const check = options.checkAuthentication.check ? options.checkAuthentication.check
    : options.checkAuthentication.by === 'self' ? checkSelf(options.name)
      : checkAny;
  const checker = options.checkAuthentication.is ? check : (r) => !check(r);
  const { onSuccess } = options.checkAuthentication;
  const onFail = makeResponder(options.checkAuthentication.onFail);
  const mw = (req, res, next) => {
    if (checker(req)) next();
    else onFail(req, res, next);
  };
  if (onSuccess) return [mw, makeResponder(onSuccess)];
  return mw;
};

const checkAuthenticated = (options) => {
  const ops = { ...options.checkAuthenticated, is: true };
  return checkAuthentication(options.copy().merge({ checkAuthentication: ops }));
};

const checkUnauthenticated = (options) => {
  const ops = { ...options.checkUnauthenticated, is: false };
  return checkAuthentication(options.copy().merge({ checkAuthentication: ops }));
};

export { checkAuthentication, checkAuthenticated, checkUnauthenticated };
