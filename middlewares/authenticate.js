const jwt = require("jsonwebtoken");
const Trainee = require("../models/trainee.model.js");
const Staff = require("../models/staff.model.js");
const Admin = require("../models/admin.model.js");
const generateToken = require("../utils/generateToken");
require("dotenv").config();


const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
  try {
    let accessToken = req.cookies.accessToken;
    let refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError" && refreshToken) {
        try {
          const refreshDecoded = jwt.verify(refreshToken, SECRET_KEY);
          const { id, role } = refreshDecoded;

          let user;
          if (role === "Trainee") {
            user = await Trainee.findById(id);
          } else if (["SalesManager", "EquipmentManager", "Coach"].includes(role)) {
            user = await Staff.findById(id);
          } else if (["Admin", "SuperAdmin"].includes(role)) {
            user = await Admin.findById(id);
          } else {
            return res.status(403).json({ message: "Forbidden: Invalid role" });
          }

          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

          const { accessToken: newAccessToken } = generateToken(user);

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 30 * 60 * 1000,
          });

          decoded = { id, role };
        } catch (refreshError) {
          return res.status(403).json({ message: "Forbidden: Invalid refresh token" });
        }
      } else {
        return res.status(403).json({ message: "Forbidden: Invalid access token" });
      }
    }

    const { id, role } = decoded;
    let user;

    if (role === "Trainee") {
      user = await Trainee.findById(id);
    } else if (["SalesManager", "EquipmentManager", "Coach"].includes(role)) {
      user = await Staff.findById(id);
    } else if (["Admin", "SuperAdmin"].includes(role)) {
      user = await Admin.findById(id);
    } else {
      return res.status(403).json({ message: "Forbidden: Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { authenticate };
