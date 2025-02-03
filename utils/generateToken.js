const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );

  return { token };
};

module.exports = generateToken;
