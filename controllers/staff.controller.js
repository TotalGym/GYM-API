const Staff = require("../models/staff.model.js");
const { paginatedResults } = require("../utils/pagination.js");
const { search } = require("../utils/search.js");
const bcrypt = require("bcrypt");

exports.getAllStaff = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const query = search(Staff, searchTerm);

    const paginatedResponse = await paginatedResults(Staff, query, req);

    res.status(200).json(paginatedResponse);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff " + error.message });
  }
};

exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select("-password -__v -updatedAt");;
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff, " + error.message });
  }
};

exports.addStaff = async (req, res) => {
  try {
    const { name, role, contact, password } = req.body;

    if (!name || !role || !contact || !contact.email || !contact.phoneNumber) {
      return res.status(400).json({
        message: "Missing required fields: name, role, contact, email, and phone number are mandatory.",
      });
    }

    const existingStaff = await Staff.findOne({ "contact.email": contact.email });
    if (existingStaff) {
      return res.status(400).json({ message: "Email is already in use by another staff member." });
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
    delete StaffData.password;
    delete StaffData.__v;
    delete StaffData.updatedAt;

    res.status(201).json({ message: "Staff added successfully", staff: StaffData });
  } catch (error) {
    res.status(500).json({ message: `Error adding staff: ${error.message}` });
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

  console.log(req.user.role);

  if ("role" in updateData && !["Admin", "SuperAdmin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Only admins can update the role." });
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password -__v -updatedAt");

    if (!updatedStaff) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({ message: "Staff updated successfully", staff: updatedStaff });
  } catch (error) {
    res.status(500).json({ message: `Error updating staff: ${error.message}` });
  }
};

exports.updatePayroll = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { salary, bonus, deductions, payDate } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: "Staff ID is required." });
    }

    if (staff.payroll?.payDate) {
      const lastPayDate = new Date(staff.payroll.payDate);
      const currentDate = new Date();

      if (
        lastPayDate.getFullYear() === currentDate.getFullYear() &&
        lastPayDate.getMonth() === currentDate.getMonth()
      ) {
        return res.status(400).json({ message: "Staff has already been paid for this month." });
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
    delete StaffData.password;
    delete StaffData.__v;
    delete StaffData.updatedAt;

    res.status(200).json({ message: "Payroll updated successfully", staff: StaffData });
  } catch (error) {
    res.status(500).json({ message: `Error updating payroll: ${error.message}` });
  }
};


exports.deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff " + error.message });
  }
};
