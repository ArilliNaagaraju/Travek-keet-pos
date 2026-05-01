const express = require("express");
const { listUsers, addUser } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, listUsers);
router.post("/", addUser);

module.exports = router;
