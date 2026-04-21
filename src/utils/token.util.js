const jwt = require('jsonwebtoken');
const { jwtSecret, tokenExpiresIn } = require('../config/auth.config');

function signAccessToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: tokenExpiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};

