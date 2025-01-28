const express = require("express");
const router = express.Router();

const {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/admin.controller.js");
const { 
  createAdminValidation, 
  updateAdminValidation, 
  deleteAdminValidation 
} = require("../utils/validators/admin.validator.js");

const validatation = require("../middlewares/validate.middleware.js");

router.get("/", getAdmins);
router.post("/", validatation(createAdminValidation), createAdmin);
router.put("/:id", validatation(updateAdminValidation), updateAdmin);
router.delete("/:id", validatation(deleteAdminValidation), deleteAdmin);

module.exports = router;


//todo : check the user stories for the admin and apply them