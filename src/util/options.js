const getType = (x) => {
  const type = typeof x;
  if (type !== 'object') return type;
  if (x === null) return 'null';
  if (Array.isArray(x)) return 'array';
  return 'object';
};

const isObj = (x) => getType(x) === 'object';

const parseOption = (option, input) => option.type.includes(getType(input));

const build = (_schema) => {
  const b = (schema, output) => {
    Object.keys(schema).forEach((key) => {
      if (schema[key].type === 'child') {
        output[key] = {};
        b(schema[key].children, output[key]);
      } else {
        if (!parseOption(schema[key], schema[key].default)) {
          throw new Error(`${key} must be of the following type/s: ${schema[key].type} is of type ${getType(schema[key].default)})}`);
        }
        output[key] = schema[key].default;
      }
    });
    return output;
  };
  return b(_schema, {});
};

const merge = (_schema, _input) => {
  const m = (schema, input, output) => {
    Object.keys(input).forEach((key) => {
      if (schema[key] === undefined) throw new Error(`Unknown option ${key}`);
      if (isObj(schema[key]) && schema[key].type === 'child') {
        m(schema[key].children, input[key], output[key]);
      } else {
        if (!parseOption(schema[key], input[key])) throw new Error(`${key} must be of the following type/s: ${schema[key].type} is of type ${getType(input[key])})}`);
        output[key] = input[key];
      }
    });
    return output;
  };
  return m(_schema, _input, build(_schema));
};

const parse = (schema, input) => {
  Object.keys(input).forEach((key) => {
    if (schema[key] === undefined) throw new Error(`Unknown option ${key}`);
    if (isObj(schema[key]) && schema[key].type === 'child') {
      parse(schema[key].children, input[key]);
    } else if (!parseOption(schema[key], input[key])) throw new Error(`${key} must be of the following type/s: ${schema[key].type} is of type ${getType(input[key])})}`);
  });
  return true;
};

export { build, merge, parse };
