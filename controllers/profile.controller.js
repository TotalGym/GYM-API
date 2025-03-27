const { responseHandler } = require("../utils/responseHandler");
const Trainee = require("../models/trainee.model");
const Staff = require("../models/staff.model");
const Admin = require("../models/admin.model");

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) return responseHandler(res, 404, false, "You are Not Found");

    const userData = {
      name: user.name,
      contact: user.contact || {},
      email: user.email || "",
      role: user.role,
      status: user.status,
      attendance: user.attendance,
    };

    return responseHandler(
      res,
      200,
      true,
      "Profile retrieved successfully",
      userData
    );
  } catch (error) {
    return responseHandler(
      res,
      500,
      false,
      "Error retrieving profile",
      null,
      error.message
    );
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, contact } = req.body;

    if (!name && !contact) {
      return responseHandler(
        res,
        400,
        false,
        "Please provide fields to update"
      );
    }

    const models = [Trainee, Staff, Admin];
    let user = null;

    for (const model of models) {
      user = await model.findById(userId);
      if (user) break;
    }

    if (!user) {
      return responseHandler(res, 404, false, "User not found");
    }

    if (user._id.toString() !== userId) {
      return responseHandler(
        res,
        403,
        false,
        "You can only update your own profile"
      );
    }

    if (name !== undefined) user.name = name;

    if (contact !== undefined) {
      if (contact.email !== undefined) user.contact.email = contact.email;
      if (contact.phone !== undefined) user.contact.phone = contact.phone;
    }

    await user.save();

    return responseHandler(res, 200, true, "Profile updated successfully");
  } catch (error) {
    return responseHandler(
      res,
      500,
      false,
      "Error updating profile",
      null,
      error.message
    );
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, email } = req.body;

    if (!name && !email) {
      return responseHandler(
        res,
        400,
        false,
        "Please provide fields to update"
      );
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return responseHandler(res, 404, false, "Admin not found");
    }

    if (admin._id.toString() !== adminId) {
      return responseHandler(
        res,
        403,
        false,
        "You can only update your own profile"
      );
    }

    if (name !== undefined) admin.name = name;
    if (email !== undefined) admin.email = email;

    await admin.save();

    return responseHandler(
      res,
      200,
      true,
      "Admin profile updated successfully"
    );
  } catch (error) {
    return responseHandler(
      res,
      500,
      false,
      "Error updating admin profile",
      null,
      error.message
    );
  }
};
