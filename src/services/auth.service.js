const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'sw2026-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function register({ name, email, password }) {
  if (!name || !email || !password) {
    const error = new Error('name, email, and password are required');
    error.status = 400;
    throw error;
  }

  if (userModel.findByEmail(email)) {
    const error = new Error('A user with this email already exists');
    error.status = 409;
    throw error;
  }

  const user = userModel.create({ name, email, password });
  const token = signToken(user);

  return { user: toPublicUser(user), token };
}

function login({ email, password }) {
  if (!email || !password) {
    const error = new Error('email and password are required');
    error.status = 400;
    throw error;
  }

  const user = userModel.findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  return { user: toPublicUser(user), token: signToken(user) };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    const error = new Error('Invalid or expired token');
    error.status = 401;
    throw error;
  }
}

module.exports = {
  register,
  login,
  verifyToken
};
