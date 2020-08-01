import models from './models';
import { merge } from './optionsFunctions';

const getOptionsObject = (modelName) => {
  if (modelName && !models[modelName]) throw new Error(`Model ${modelName} is not set`);
  return models[modelName || '_default'];
};

const buildOptions = (modelName, overrides, prefix) => merge(
  getOptionsObject(modelName), { [prefix]: overrides }
);

export default buildOptions;
