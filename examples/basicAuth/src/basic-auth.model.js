import { Model } from 'hadrian';
import { findClientById } from './db';

const auth = new Model({
  name: 'basicAuth',
  authenticate: {
    selfInit: true,
    extract: (req) => {
      const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
      const [id, secret] = Buffer.from(b64auth, 'base64').toString().split(':');
      return { id, secret };
    },
    getUser: (query) => findClientById(query.id),
    verify: (query, client) => query.secret === client.secret
  }
});

export default auth;
