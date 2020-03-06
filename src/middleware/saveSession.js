
const saveSession = (overrides) => {
  const { serialize } = overrides;
  return (req, res, next) => {
    serialize(req.deserializedUser, (err, serializedUser) => {
      req.hadrian.user = serializedUser;
      req.session.hadrian = req.hadrian;
      next();
    });
  };
};

export default saveSession;
