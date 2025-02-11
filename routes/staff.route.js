const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller.js");
const authorizeRole = require("../middlewares/authorize.middleware.js");
const validation = require("../middlewares/validate.middleware.js");
const { createStaffValidation, updateStaffValidation, updatePayrollValidation } = require("../utils/validators/staff.validator.js");

router.get("/", authorizeRole(["Admin", "SuperAdmin"]), staffController.getAllStaff);
router.get("/:id", authorizeRole(["SuperAdmin", "Admin", "Staff"]), staffController.getStaffById);

router.post("/", authorizeRole(["SuperAdmin", "Admin"]), validation(createStaffValidation), staffController.addStaff);
router.put("/:id", 
    authorizeRole(["SuperAdmin", "Admin", "Coach",  "EquipmentManager" , "SalesManager"]),
    validation(updateStaffValidation),
    staffController.updateStaff
);

router.put("/update-payroll/:id", 
    authorizeRole(["SuperAdmin", "Admin"]),
    validation(updatePayrollValidation),
    staffController.updatePayroll
);


router.delete("/:id", authorizeRole(["SuperAdmin", "Admin"]), staffController.deleteStaff);

module.exports = router;
