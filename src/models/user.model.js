const bcrypt = require('bcryptjs');

const passwordHash = bcrypt.hashSync('password123', 10);

const users = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: passwordHash
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: passwordHash
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: passwordHash
  }
];

let nextUserId = 4;

function findAll() {
  return users;
}

function findByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function findById(id) {
  return users.find((user) => user.id === id);
}

function create({ name, email, password }) {
  const user = {
    id: nextUserId++,
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 10)
  };
  users.push(user);
  return user;
}

module.exports = {
  findAll,
  findByEmail,
  findById,
  create
};
