import schema from './optionsSchema';
import { build as b, merge as m, parse as p } from '../util/options';

const buildDefault = () => b(schema);
const merge = (input) => m(schema, input);
const parse = (input) => p(schema, input);

export { merge, buildDefault, parse };
