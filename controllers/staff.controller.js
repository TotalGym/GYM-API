const Staff = require("../models/staff.model.js");
const { paginatedResults } = require("../utils/pagination.js");
const { search } = require("../utils/search.js");

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
    const staff = await Staff.findById(req.params.id);
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

    const newStaff = new Staff({
      name,
      role,
      contact,
      password: password || contact.phoneNumber,
    });

    await newStaff.save();

    res.status(201).json({ message: "Staff added successfully", staff: newStaff });
  } catch (error) {
    res.status(500).json({ message: `Error adding staff: ${error.message}` });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStaff) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json({ message: "Staff updated successfully", updatedStaff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePayroll = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { salary, bonus, deductions, payDate } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: "Staff ID is required." });
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

    res.status(200).json({ message: "Payroll updated successfully", staff: updatedStaff });
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
