const { success, fail } = require("../utils/response");
const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    // Fixed: success utility only takes (res, data, statusCode)
    return success(res, { message: "User registered successfully", ...result }, 201);
  } catch (error) {
    if (error.message === "User already exists") {
      return fail(res, error.message, 400);
    }
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    if (!result) return fail(res, "Invalid credentials", 401);
    return success(res, result, 200);
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
