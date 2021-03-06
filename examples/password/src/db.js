// The users database
const users = {
  bob: { username: 'bob', password: 'password' },
  dave: { username: 'dave', password: 'password' }
};

const findUserByUserName = (username) => new Promise((resolve) => {
  setTimeout(() => resolve(users[username] || null), 100);
});

export { users, findUserByUserName };
