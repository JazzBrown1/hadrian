const manualDeserializeInit = async (s, deserialize) => async function getUser() {
  if (this.deserializedUser) return this.deserializedUser;
  const deserializedUser = deserialize(this.hadrian.user);
  this.deserializedUser = deserializedUser;
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
