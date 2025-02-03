const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const Trainee = require("../models/trainee.model.js");
const Staff = require("../models/staff.model.js");
const Admin = require("../models/admin.model.js");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { id, role } = decoded;

    let user;

    if (role === "Trainee") {
      user = await Trainee.findById(id);
    } else if (role === "SalesManager" || role === "EquipmentManager" || role === "Coach") {
      user = await Staff.findById(id);
    } else if (role === "Admin" || role === "SuperAdmin") {
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
    return res.status(403).json({ message: "Forbidden: Invalid token, " + error.message });
  }
};

module.exports = { authenticate };