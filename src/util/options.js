/* eslint-disable max-len */

// Will expand at https://github.com/JazzBrown1/options/

const getType = (x) => {
  const type = typeof x;
  if (type !== 'object') return type;
  if (x === null) return 'null';
  if (Array.isArray(x)) return 'array';
  return 'object';
};

const unknownError = (path, key) => `Unknown option ${path.join('.')}.${key}`;
const typeError = (path, key, schema) => `${path.join('.')}.${key} is of type ${getType(schema[key].default)}, must be of the following type/s: ${schema[key].type}`;

const parseOption = (option, input) => option.type.includes(getType(input));

const checkUnknowns = (schema, input = {}, path = []) => {
  Object.keys(input).forEach((key) => {
    if (schema[key] === undefined) throw new Error(unknownError(path, key));
    if (schema[key].type === 'child') checkUnknowns(schema[key].children, input[key], [...path, key]);
  });
  return input;
};

const merge = (_schema, input = {}, input2 = {}) => {
  const m = (schema, output, overrides, path) => {
    Object.keys(schema).forEach((key) => {
      if (schema[key].type === 'child') {
        if (!output[key]) output[key] = {};
        m(schema[key].children, output[key], overrides[key] || {}, [...path, key]);
      } else if (overrides[key]) {
        if (!parseOption(schema[key], overrides[key])) throw new Error(typeError(path, key, schema));
        output[key] = overrides[key];
      } else if (output[key]) {
        if (!parseOption(schema[key], output[key])) throw new Error(typeError(path, key, schema));
      } else {
        // Unneeded typecheck with fixed correct schema if (!parseOption(schema[key], schema[key].default)) throw new Error(typeError(path, key, schema));
        output[key] = schema[key].default;
      }
    });
    return output;
  };
  checkUnknowns(_schema, input);
  checkUnknowns(_schema, input2);
  return m(_schema, input, input2, []);
};

export default merge;
