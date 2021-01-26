const clients = {
  user: {
    id: 'user',
    secret: 'password',
    someInfo: 'You are the only client',
    otherInfo: 'The sky is blue'
  }
};

const findClientById = (id) => new Promise((resolve) => {
  setTimeout(() => resolve(clients[id] || null), 100);
});

export { clients, findClientById };
