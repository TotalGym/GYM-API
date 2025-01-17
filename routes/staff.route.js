const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller.js");
const authorizeRole = require("../middlewares/authorize.middleware.js");

router.get("/", authorizeRole(["Admin", "SuperAdmin"]), staffController.getAllStaff);
router.get("/:id", authorizeRole(["SuperAdmin", "Admin", "Staff"]), staffController.getStaffById);

router.post("/", authorizeRole(["SuperAdmin", "Admin"]), staffController.addStaff);
router.put("/:id", authorizeRole(["SuperAdmin", "Admin", "Coach",  "EquipmentManager" , "SalesManager"]), staffController.updateStaff);
router.put("/:id", authorizeRole(["SuperAdmin", "Admin", "Coach",  "EquipmentManager" , "SalesManager"]), staffController.updatePayroll);


router.delete("/:id", authorizeRole(["SuperAdmin", "Admin"]), staffController.deleteStaff);

module.exports = router;
