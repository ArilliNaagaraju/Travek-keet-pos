const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

async function register(userData) {
  const { name, email, password } = userData;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d"
  });

  return {
    token,
    user: { _id: user._id, name: user.name, email: user.email }
  };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) return null;

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d"
  });

  return { token, user: { _id: user._id, name: user.name, email: user.email } };
}

module.exports = { register, login };
