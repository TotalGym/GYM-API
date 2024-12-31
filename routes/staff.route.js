const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller.js");
const authorizeRole = require("../middlewares/authorize.middleware.js");

router.get("/", authorizeRole(["Admin", "superAdmin"]), staffController.getAllStaff);
router.get("/:id", authorizeRole(["superAdmin", "Admin", "Staff"]), staffController.getStaffById);

router.post("/", authorizeRole(["superAdmin", "Admin"]), staffController.addStaff);
router.put("/:id", authorizeRole(["superAdmin", "Admin", "Staff"]), staffController.updateStaff);

router.delete("/:id", authorizeRole(["superAdmin", "Admin"]), staffController.deleteStaff);

module.exports = router;
