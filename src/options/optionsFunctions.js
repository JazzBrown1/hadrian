import schema from './optionsSchema';
import m from '../util/options';

const buildDefault = () => m(schema);
const merge = (input, input2) => m(schema, input, input2);
const parse = (input) => m(schema, {}, input);

export { merge, buildDefault, parse };
