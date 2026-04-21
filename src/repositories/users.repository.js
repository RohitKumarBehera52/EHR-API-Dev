const path = require('path');
const { readJson } = require('./json.repository');

const usersFilePath = path.join(__dirname, '../data/users.json');

async function findAll() {
  return readJson(usersFilePath, []);
}

async function findByUsername(username) {
  const users = await findAll();
  return users.find((user) => user.username === username) || null;
}

module.exports = {
  findAll,
  findByUsername
};

