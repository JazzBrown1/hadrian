import models from './models';

const addEventsToOptions = (options, prefix) => {
  if (options.onFail) options[`${prefix}OnFail`] = options.onFail;
  if (options.onError) options[`${prefix}OnError`] = options.onError;
  if (options.onSuccess) options[`${prefix}OnSuccess`] = options.onSuccess;
  return options;
};

const makeOptionsObject = (modelName, overrides) => {
  if (modelName && !models[modelName]) throw new Error('model is not set');
  return { ...models[modelName || '_default'], ...overrides };
};
const getOptionsObject = (modelName) => {
  if (modelName && !models[modelName]) throw new Error('model is not set');
  return models[modelName || '_default'];
};

const parseOptions = (options) => {
  if (typeof options.authenticate.verify !== 'function') throw new Error('verify must be a function');
  if (typeof options.authenticate.getData !== 'function') throw new Error('getUser must be a function');
  return options;
};

const buildOptions = (modelName, overrides, prefix) => {
  const options = makeOptionsObject(modelName, overrides);
  addEventsToOptions(options, prefix);
  parseOptions(options);
  return options;
};

const buildOptions2 = (modelName, overrides, prefix) => {
  const options = { ...getOptionsObject(modelName) };
  options[prefix] = { ...options[prefix], ...overrides };
  parseOptions(options);
  return options;
};

export default buildOptions;

export { buildOptions2 };
