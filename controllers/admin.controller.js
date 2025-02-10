const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const { search } = require("../utils/search");
const { paginatedResults } = require("../utils/pagination");
const { responseHandler } = require("../utils/responseHandler");


exports.getAdmins = async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const query = search(Admin, searchTerm);

    const admins = await paginatedResults(Admin, query, req);

    responseHandler(res, 200, true, "Admins fetched successfully", admins);
  } catch (error) {
    responseHandler(res, 500, false, "Something went wrong", null, error.message);
  }
};

exports.createAdmin = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      if (req.user.role !== "SuperAdmin") {
        return responseHandler(res, 403, false, "You are not authorized to create an admin.");
      }
  
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) return responseHandler(res, 400, false, "Email already exists");
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
        role,
      });
  
      const addedAdmin =  await newAdmin.save();

      responseHandler(res, 201, true, "Admin created successfully", addedAdmin);
    } catch (error) {
      responseHandler(res, 500, false, "Something went wrong", null, error.message);
    }
  };


  exports.updateAdmin = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    if (req.user.role !== "SuperAdmin") {
      return responseHandler(res, 403, false, "You are not authorized to update an admin.");
    }
  
    try {
      const admin = await Admin.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select("-__v -password -updatedAt");
      if (!admin) return responseHandler(res, 404, false, "Admin not found");
  
      responseHandler(res, 200, true, "Admin updated successfully", admin);
    } catch (error) {
      responseHandler(res, 500, false, `Something went wrong: ${error.message}`);
    }
  };

  exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;
  
    if (req.user.role !== "SuperAdmin") {
      return responseHandler(res, 403, false, "You are not authorized to delete an admin.");
    }
  
    try {
      const admin = await Admin.findById(id);
      if (!admin) return responseHandler(res, 404, false, "Admin not found");
  
      if (admin.role === "SuperAdmin" && admin._id.toString() === req.user.id) {
        return responseHandler(res, 403, false, "You cannot delete your own account.");
      }
  
      await Admin.findByIdAndDelete(id);
      responseHandler(res, 200, true, "Admin deleted successfully");
    } catch (error) {
      responseHandler(res, 500, false, "Something went wrong", null, error.message);
    }
  };
  
  