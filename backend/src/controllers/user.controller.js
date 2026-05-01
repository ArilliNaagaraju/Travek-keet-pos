const { success } = require("../utils/response");
const userService = require("../services/user.service");

async function listUsers(req, res, next) {
  try {
    const users = await userService.getUsers();
    return success(res, users);
  } catch (error) {
    return next(error);
  }
}

async function addUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return success(res, user, 201);
  } catch (error) {
    return next(error);
  }
}

module.exports = { listUsers, addUser };
