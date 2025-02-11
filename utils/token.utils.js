const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

exports.generateJWT = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};