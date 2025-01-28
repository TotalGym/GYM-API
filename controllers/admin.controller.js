const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");


exports.getAdmins = async (req, res) => {
    try {
      const admins = await Admin.find();
      res.status(200).json({ admins });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
    }
};


exports.createAdmin = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      if (req.user.role !== "SuperAdmin") {
        return res.status(403).json({ message: "You are not authorized to create an admin." });
      }
  
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) return res.status(400).json({ message: "Email already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
        role,
      });
  
      await newAdmin.save();
      res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
    }
  };


  exports.updateAdmin = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "You are not authorized to update an admin." });
    }
  
    try {
      const admin = await Admin.findByIdAndUpdate(id, updates, { new: true });
      if (!admin) return res.status(404).json({ message: "Admin not found" });
  
      res.status(200).json({ message: "Admin updated successfully", admin });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong, " + error.message });
    }
  };

  exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;
  
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "You are not authorized to delete an admin." });
    }
  
    try {
      const admin = await Admin.findById(id);
      if (!admin) return res.status(404).json({ message: "Admin not found" });
  
      if (admin.role === "SuperAdmin" && admin._id.toString() === req.user.id) {     //not needed ?
        return res.status(403).json({ message: "You cannot delete your own account" });
      }
  
      await Admin.findByIdAndDelete(id);
      res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
    }
  };
  
  