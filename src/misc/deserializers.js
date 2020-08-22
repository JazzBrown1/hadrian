const manualDeserializeInit = async (s, deserialize, req) => async function getUser() {
  if (req.deserializedUser) return req.deserializedUser;
  const deserializedUser = deserialize(req.hadrian.user);
  req.deserializedUser = deserializedUser;
  return deserializedUser;
};

const manualDeserializeAuth = () => function getUser() {
  return Promise.resolve(this.deserializedUser);
};

const alwaysDeserializeInit = async (serializedUser, deserialize, req) => {
  const user = await deserialize(serializedUser);
  req.deserializedUser = user;
  return user;
};

const alwaysDeserializeAuth = (deserializedUser) => deserializedUser;

export {
  alwaysDeserializeAuth, alwaysDeserializeInit, manualDeserializeAuth, manualDeserializeInit
};
