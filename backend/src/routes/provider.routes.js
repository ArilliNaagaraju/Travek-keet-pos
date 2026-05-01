const express = require("express");
const { registerProvider, getProviders } = require("../controllers/provider.controller");

const router = express.Router();

router.post("/register", registerProvider);
router.get("/", getProviders);

module.exports = router;
