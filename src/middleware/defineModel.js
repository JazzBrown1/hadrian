import models from '../options/models';
import makeDefaults from '../options/makeDefaults';

import merge from '../util/mergeObject';

const defineModel = (model, options, isDefault) => {
  if (typeof model === 'object') {
    isDefault = options;
    options = model;
    if (!options.name) throw new Error('Model must have a name');
    model = model.name;
  }
  // First model defined is always set to default unless explicitly set to false
  if (models.length < 2 && isDefault !== false) isDefault = true;

  models[model] = merge(makeDefaults(), options, 1);
  models[model].name = model; // name overridden by model name if specified
  models[model].isDefault = isDefault; // is default cannot be declared in options obj by design
  if (isDefault) {
    models._default = models[model];
  }
};

export default defineModel;
