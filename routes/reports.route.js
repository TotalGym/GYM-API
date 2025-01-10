const express = require("express");
const router = express.Router();
const authorizeRole = require("../middlewares/authorize.middleware");
const { 
  generateStoreReport,
  generateStaffReport,
  generateTraineeReport, 
  generateEquipmentReport, 
  generateProgramsReport, 
  generatePaymentsReport, 
} = require("../controllers/reports.controller");

router.get(
  "/trainee-report",
  authorizeRole(["Admin", "SuperAdmin", "Coach"]),
  generateTraineeReport
);

router.get(
  "/equipment-report",
  authorizeRole(["Admin", "SuperAdmin", "EquipmentManager"]),
  generateEquipmentReport
);

router.get(
    "/staff-report",
    authorizeRole(["Admin", "SuperAdmin"]),
    generateStaffReport
);

router.get(
    "/programs-report",
    authorizeRole(["Admin", "SuperAdmin", "Coach"]),
    generateProgramsReport
);

router.get(
    "/payments-reports",
    authorizeRole(["Admin", "SuperAdmin"]),
    generatePaymentsReport
);

router.get(
    "/store-report",
    authorizeRole(["Admin", "SuperAdmin", "SalesManager"]),
    generateStoreReport
);


module.exports = router;
