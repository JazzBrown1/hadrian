import shortid from 'shortid';
import hashPassword from 'hash-password';

const pw = hashPassword();

const wait = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// The users database
const users = {
  LxnvxHoI: {
    id: 'LxnvxHoI',
    username: 'bob',
    password: pw.generate('password') // Outputs a hashed password json
  },
  jeSpY1Y2I: {
    id: 'jeSpY1Y2I',
    username: 'dave',
    password: pw.generate('secret') // Outputs a hashed password json
  }
};

const findUserById = (id, cb) => {
  if (!users[id]) return cb(null, null);
  cb(null, users[id]);
};

const findUserByUserName = (username, cb) => {
  const user = Object.keys(users).find((key) => users[key].username === username);
  cb(null, users[user]);
};

const insertUser = (username, password, cb) => {
  findUserByUserName(username, (err, user) => {
    if (user) return cb(null, null);
    const insertedUser = { username, password, id: shortid.generate() };
    users[insertedUser.id] = insertedUser;
    cb(null, insertedUser);
  });
};

export {
  users, findUserByUserName, insertUser, findUserById
};
