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


exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (req.user.id !== id) {
    return res.status(403).json({ message: "You are not allowed to change this password" });
  }

  try {
    const models = [
      { model: Trainee },
      { model: Staff },
      { model: Admin },
    ];

    let user = null;
    let userRole = null;

    for (const { model } of models) {
      user = await model.findById(id);
      if (user) {
        role = user.role;
        userRole = role;
        break;
      }
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully"});
  } catch (error) {
    res.status(500).json({ message: "Error updating password - " + error.message });
  }
};


// exports.resetPassword = async (req, res) => {
//   const { id } = req.params;
//   const { oldPassword, newPassword } = req.body;

//   if (req.user.id !== id) {
//     return res.status(403).json({ message: "You are not allowed to change this password" });
//   }

//   try {
//     const models = [
//       { model: Trainee, role: "Trainee" },
//       { model: Staff, role: "Coach" },
//       { model: Admin, role: "Admin" },
//     ];

//     let user = null;
//     let userRole = null;

//     for (let { model, role } of models) {
//       user = await model.findById(id);
//       if (user) {
//         role = user.role;
//         userRole = role;
//         break;
//       }
//     }

//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, role: userRole },
//       SECRET_KEY
//     );

//     res.status(200).json({ message: "Password updated successfully", token });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating password - " + error.message });
//   }
// };