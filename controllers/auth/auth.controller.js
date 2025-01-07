const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendEmail = require("../../utils/sendEmail.js");

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
      SECRET_KEY,
      { expiresIn: '1d' }
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


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const models = [
      { model: Trainee },
      { model: Staff },
      { model: Admin },
    ];

    let user = null;

    for (let { model } of models) {
      user = await model.findOne({ "contact.email": email }) || await model.findOne({ email });
      if (user) break;
    }

    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.resetOtp = hashedOtp;
    user.resetOtpExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
    await user.save();

    //ToDo: Add resetOtp & resetOtpExpires to the Actors Models

    // Check this  ↓↓↓  
    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      message: `Your OTP for password reset is ${otp}. It is valid for 15 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP - " + error.message });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body; // Remove email ?

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }

  try {
    const models = [
      { model: Trainee },
      { model: Staff },
      { model: Admin },
    ];

    let user = null;

    for (let { model } of models) {
      user = await model.findOne({ "contact.email": email }) || await model.findOne({ email });
      if (user) break;
    }

    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    if (Date.now() > user.resetOtpExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.resetOtp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    console.log(user.role);

    await user.save();

    //send the token here or go to login ?

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password - " + error.message });
  }
};


//Todo: Add the Reset Password Verification 