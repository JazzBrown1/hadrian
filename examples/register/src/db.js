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

const findUserById = async (id) => {
  await wait('50');
  return users[id];
};

const findUserByUserName = async (username) => {
  await wait('50');
  return Object.values(users).find((val) => val.username === username);
};

const insertUser = async (username, password) => {
  await wait('50');
  const insertedUser = { username, password, id: shortid.generate() };
  users[insertedUser.id] = insertedUser;
  return insertedUser;
};

export {
  users, findUserByUserName, insertUser, findUserById
};
