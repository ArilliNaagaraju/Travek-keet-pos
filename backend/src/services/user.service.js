const User = require("../models/user.model");

async function getUsers() {
  return User.find().sort({ createdAt: -1 });
}

async function createUser(payload) {
  return User.create(payload);
}

module.exports = { getUsers, createUser };
