const Provider = require("../models/provider.model");
const { success, fail } = require("../utils/response");

async function registerProvider(req, res, next) {
  try {
    const provider = new Provider(req.body);
    await provider.save();
    return success(res, provider, 201);
  } catch (error) {
    return next(error);
  }
}

async function getProviders(req, res, next) {
  try {
    const providers = await Provider.find().populate("userId");
    return success(res, providers);
  } catch (error) {
    return next(error);
  }
}

module.exports = { registerProvider, getProviders };
