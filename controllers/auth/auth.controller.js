const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendEmail = require("../../utils/sendEmail.js");

const Trainee = require("../../models/trainee.model.js");
const Staff = require("../../models/staff.model.js");
const Admin = require("../../models/admin.model.js");
const generateToken = require("../../utils/generateToken.js");
const {responseHandler} = require("../../utils/responseHandler.js");

require("dotenv").config();

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const isDashboard = req.baseUrl.startsWith("/api/dashboard");


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

    if (!user) return responseHandler(res, 400, false, "Invalid credentials");

    const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password);
    
    if (!isPasswordCorrect) return responseHandler(res, 400, false, "Invalid credentials");

    if (isDashboard && userRole === "Trainee") {
      return responseHandler(res, 403, false, "Access Denied");
    }

    const { token } = generateToken(user);
  
    const userData = {
      name : user.name,
      email: user.contact?.email || user.email,
      role : userRole,
      id: user._id
    }

    responseHandler(res, 200, true, "Logged In Successfully", {token, userData});
  } catch (error) {
    responseHandler(res, 500, false, "Something went wrong", null, error.message)
  }
};


exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (req.user.id !== id) {
    return responseHandler(res, 403, false, "You are not allowed to change this password");
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

    if (!user) return responseHandler(res, 404, "User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return responseHandler(res, 400, false, "Old password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    responseHandler(res, 200, true, "Password updated successfully");
  } catch (error) {
    responseHandler(res, 500, false, "Error updating password..", null,  error.message);
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return responseHandler(res, 400, false, "Email is required");


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

    if (!user) return responseHandler(res, 404, false, "No user found with this email");


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.passwordResetCode = hashedOtp;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
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

    responseHandler(res, 200, true, "OTP sent to your email");
  } catch (error) {
    responseHandler(res, 500, false, "Error sending OTP", null, error.message);
  }
};


exports.verifyResetCode = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return responseHandler(res, 400, false, "Email and OTP are required");


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

    if (!user) return responseHandler(res, 404, false, "No user found with this email");
    if (!user.passwordResetCode || !user.passwordResetExpires || Date.now() > user.passwordResetExpires) return responseHandler(res, 400, false, "Invalid or expired OTP");


    if (Date.now() > user.passwordResetExpires) {
      return responseHandler(res, 400, false, "OTP has expired");
    }

    const isOtpValid = await bcrypt.compare(otp, user.passwordResetCode);
    if (!isOtpValid) return responseHandler(res, 400, false, "Invalid OTP");


    user.passwordResetVerified = true;
    await user.save();

    responseHandler(res, 200, true, "Code verified");
  } catch (error) {
    responseHandler(res, 500, false, "Error verifying code", null, error.message);
  }
};



exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) return responseHandler(res, 400, false, "Email and new password are required");


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

    if (!user || !user.passwordResetVerified) return responseHandler(res, 400, false, "OTP has not been verified");


    if (!user.passwordResetVerified) {
      return res.status(400).json({ message: "OTP has not been verified" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    responseHandler(res, 200, true, "Password reset successfully");
  } catch (error) {
    responseHandler(res, 500, false, "Error resetting password", null, error.message);
  }
};

exports.getLoggedUser = (req, res) => {
  try {
    const user = req.user;

    const userData = {
      name : user.name,
      email: user.contact?.email || user.email,
      role : user.role,
      id: user._id
    }
   
    responseHandler(res, 200, true, "Retrieve User Successfully", userData);
  } catch (error) {
    responseHandler(res, 500, "Error getting user data", null, error.message);
  }
};


exports.checkAuth = (req, res) => {
  try {
    responseHandler(res, 200, true, "Authenticated", { authenticated: true });
  } catch (error) {
    responseHandler(res, 500, false, "Authentication check failed", null, error.message);
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmDelete } = req.body;

    if (req.user.role !== "SuperAdmin") {
      return responseHandler(res, 403, false, "Only SuperAdmins can delete users.");
    }

    const user = await Staff.findById(id);
    if (!user) {
      return responseHandler(res, 404, false, "User not found.");
    }

    if (!confirmDelete || confirmDelete !== "CONFIRM") {
      return responseHandler(res, 400, false, "Deletion not confirmed. Send { confirmDelete: 'CONFIRM' } in request body.");
    }

    await Staff.findByIdAndDelete(id);

    responseHandler(res, 200, true, "User deleted successfully.");
  } catch (error) {
    responseHandler(res, 500, false, `Error deleting user: ${error.message}`);
  }
};