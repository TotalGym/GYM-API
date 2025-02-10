const Staff = require("../models/staff.model.js");
const { paginatedResults } = require("../utils/pagination.js");
const { responseHandler } = require("../utils/responseHandler.js");
const { search } = require("../utils/search.js");
const bcrypt = require("bcrypt");

exports.getAllStaff = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const query = search(Staff, searchTerm);

    const paginatedResponse = await paginatedResults(Staff, query, req);

    responseHandler(res, 200, true, "Staff retrieved successfully", paginatedResponse);
  } catch (error) {
    responseHandler(res, 500, false, "Error fetching staff", null, error.message);
  }
};

exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return responseHandler(res, 404, false, "Staff not found");

    responseHandler(res, 200, true, "Staff retrieved successfully", staff);
  } catch (error) {
    responseHandler(res, 500, false, "Error fetching staff", null, error.message);
  }
};

exports.addStaff = async (req, res) => {
  try {
    const { name, role, contact, password } = req.body;

    if (!name || !role || !contact || !contact.email || !contact.phoneNumber) {
      return responseHandler(res, 400, false, "Missing required fields: name, role, email, and phone number are mandatory.");
    }

    const existingStaff = await Staff.findOne({ "contact.email": contact.email });
    if (existingStaff) {
      return responseHandler(res, 400, false, "Email is already in use by another staff member.");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      name,
      role,
      contact,
      password: hashedPassword,
    });

    await newStaff.save();

    const StaffData = newStaff.toObject();

    responseHandler(res, 201, true, "Staff added successfully", StaffData);
  } catch (error) {
    responseHandler(res, 500, false, "Error adding staff", null, error.message);
  }
};

exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["name", "role", "contact"];

  const updateData = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      updateData[key] = req.body[key];
    }
  });

  if ("role" in updateData && !["Admin", "SuperAdmin"].includes(req.user.role)) {
    return responseHandler(res, 403, false, "Only admins can update the role.");
  }

  if (Object.keys(updateData).length === 0) {
    return responseHandler(res, 400, false, "No valid fields to update");
  }

  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password -__v -updatedAt");

    if (!updatedStaff) return responseHandler(res, 404, false, "Staff not found");

    responseHandler(res, 200, true, "Staff updated successfully", updatedStaff);
  } catch (error) {
    responseHandler(res, 500, false, "Error updating staff", null, error.message);
  }
};

exports.updatePayroll = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { salary, bonus, deductions, payDate } = req.body;

    if (!staffId) {
      return responseHandler(res, 400, false, "Staff ID is required.");
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return responseHandler(res, 404, false, "Staff not found.");
    }

    if (staff.payroll?.payDate) {
      const lastPayDate = new Date(staff.payroll.payDate);
      const currentDate = new Date();

      if (
        lastPayDate.getFullYear() === currentDate.getFullYear() &&
        lastPayDate.getMonth() === currentDate.getMonth()
      ) {
        return responseHandler(res, 400, false, "Staff has already been paid for this month.");
      }
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      {
        payroll: {
          salary: salary || 0,
          bonus: bonus || 0,
          deductions: deductions || 0,
          payDate: payDate || Date.now(),
        },
      },
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found." });
    }

    const StaffData = updatedStaff.toObject();

    responseHandler(res, 200, true, "Payroll updated successfully", StaffData);
  } catch (error) {
    responseHandler(res, 500, false, "Error updating payroll", null, error.message);
  }
};


exports.deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) return responseHandler(res, 404, false, "Staff not found");
    responseHandler(res, 200, true, "Staff deleted successfully");
  } catch (error) {
    responseHandler(res, 500, false, "Error deleting staff", null, error.message);
  }
};
