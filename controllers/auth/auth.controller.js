const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendEmail = require("../../utils/sendEmail.js");

const Trainee = require("../../models/trainee.model.js");
const Staff = require("../../models/staff.model.js");
const Admin = require("../../models/admin.model.js");
const generateToken = require("../../utils/generateToken.js");

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

    const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password);
    
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateToken(user);

   res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = {
      name : user.name,
      email: user.contact?.email || user.email,
      role : userRole,
      id: user._id
    }

    res.status(200).json({ message: "Logged in successfully", accessToken, userData });
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

    user.passwordResetCode = hashedOtp;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
    await user.save();

    try {
      
      await sendEmail({
        to: email,
        subject: "Password Reset OTP",
        message: `Your OTP is ${otp}. It is valid for 15 minutes.`,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({message: "Error sending the email"})
    }

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP - " + error.message });
  }
};


exports.verifyResetCode = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
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

    if (!user.passwordResetCode || !user.passwordResetExpires) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    if (Date.now() > user.passwordResetExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.passwordResetCode);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({ message: "Code verified" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying code - " + error.message });
  }
};



exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
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

    if (!user.passwordResetVerified) {
      return res.status(400).json({ message: "OTP has not been verified" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password - " + error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized: Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const { id, role } = decoded;

    const { accessToken, refreshToken: newRefreshToken } = generateToken({ id, role });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Token refreshed" });

  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(403).json({ message: "Forbidden: Invalid refresh token" });
  }
};



exports.getLoggedUser = (req, res) => {
  try {
      res.json({ authenticated: true, user: req.user });
  } catch (error) {
      res.json({error: error.message});
  }
};


exports.checkAuth = (req, res) => {
  try {
      res.json({ authenticated: true });
  } catch (error) {
      res.json({ authenticated: false ,error: error.message });
  }
};