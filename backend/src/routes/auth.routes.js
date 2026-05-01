const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const validateAuth = require("../validations/auth.validation");

const router = express.Router();

router.post("/register", register);
router.post("/login", validateAuth, login);

module.exports = router;
