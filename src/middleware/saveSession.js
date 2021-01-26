const saveSession = (options, onError) => {
  const { serialize } = options.sessions;
  return (req, res, next) => {
    const run = async () => {
      const serializedUser = await serialize(req.deserializedUser);
      req.hadrian.user = serializedUser;
      req.session.hadrian = req.hadrian;
      next();
    };
    run().catch((err) => onError(req, res, next, err));
  };
};

export default saveSession;
