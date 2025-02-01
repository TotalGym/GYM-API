const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "30m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

module.exports = generateToken;
