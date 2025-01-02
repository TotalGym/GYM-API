const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Trainee = require("../../models/trainee.model.js");
const Staff = require("../../models/staff.model.js");
const Admin = require("../../models/admin.model.js");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const models = [
      { model: Trainee, query: { "contact.email": email }},
      { model: Staff, query: { "contact.email": email }},
      { model: Admin, query: { email }}, 
    ];

    let user = null;
    let userRole = null;

    for (const { model, query } of models) {
      user = await model.findOne(query);
    
      if (user) {
        userRole = user.role;
        break;
      }
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: userRole },
      SECRET_KEY
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error: " +  error.message });
  }
};
