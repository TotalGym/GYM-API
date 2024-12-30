const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Trainee = require("../../models/trainee.model.js");
const Staff = require("../models/staff.model");
const Admin = require("../models/admin.model");
require('dotenv').config();


const SECRET_KEY = process.env.SECRET_KEY;


//Login function for all roles
const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let model;

    if (role === "Trainee") model = Trainee;
    else if (role === "Staff") model = Staff;
    else if (role === "Admin") model = Admin;
    else return res.status(400).json({ message: "Invalid role" });

    const Trainee = await model.findOne({ "contact.email": email }); // Assuming email is in contact object
    if (!Trainee) return res.status(404).json({ message: "Trainee not found" });

    const isPasswordCorrect = await bcrypt.compare(password, Trainee.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: Trainee._id, role }, // Payload
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = { login };
