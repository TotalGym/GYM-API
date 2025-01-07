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
const { paginatedResults } = require("../utils/pagination");
const Trainee = require("../models/trainee.model");
const Equipment = require("../models/equipment.model");
const staffModel = require("../models/staff.model");
const Program = require("../models/programs.model");
const Payment = require("../models/payments.model");
const Store = require("../models/store.model");

router.get(
  "/trainee-report",
  authorizeRole(["Admin", "SuperAdmin"]),
  paginatedResults(Trainee),
  generateTraineeReport
);


router.get(
  "/equipment-report",
  authorizeRole(["Admin", "SuperAdmin"]),
  paginatedResults(Equipment),
  generateEquipmentReport
);


router.get(
    "/staff-report",
    authorizeRole(["Admin", "SuperAdmin"]),
    paginatedResults(staffModel),
    generateStaffReport
);


router.get(
    "/programs-report",
    authorizeRole(["Admin", "SuperAdmin"]),
    paginatedResults(Program),
    generateProgramsReport
);


router.get(
    "/payments-reports",
    authorizeRole(["Admin", "SuperAdmin"]),
    paginatedResults(Payment),
    generatePaymentsReport
);


router.get(
    "/store-report",
    authorizeRole(["Admin", "SuperAdmin"]),
    paginatedResults(Store),
    generateStoreReport
);


module.exports = router;
