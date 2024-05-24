const jwt = require("jsonwebtoken");

const generateToken = (user, secret, expiresIn) => {
  return jwt.sign(user, secret, { expiresIn });
};

module.exports = generateToken;
