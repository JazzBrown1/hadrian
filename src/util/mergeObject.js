const isObj = (x) => typeof x === 'object' && x !== null && !Array.isArray(x);

const merge = (a, b, i = 0) => {
  Object.keys(b).forEach((key) => {
    if (a[key] === undefined) throw new Error(`Unknown option ${key}`);
    if (isObj(a[key]) && isObj(b[key]) && i > 0) merge(a[key], b[key], i - 1);
    else a[key] = b[key];
  });
  return a;
};

export default merge;
