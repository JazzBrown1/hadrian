import models from './models';
import { parse } from './optionsFunctions';

const getOptionsObject = (modelName) => {
  if (modelName && !models[modelName]) throw new Error(`Model ${modelName} is not set`);
  return models[modelName || '_default'];
};

const buildOptions = (modelName, overrides, prefix) => {
  const options = { ...getOptionsObject(modelName) };
  options[prefix] = { ...options[prefix], ...overrides };
  parse(options);
  return options;
};

export default buildOptions;
