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

const validate = require("../middlewares/validate.middleware.js");

router.get("/", getAdmins);
router.post("/", validate(createAdminValidation), createAdmin);
router.put("/:id", validate(updateAdminValidation), updateAdmin);
router.delete("/:id", validate(deleteAdminValidation), deleteAdmin);

module.exports = router;


//todo : check the user stories for the admin and apply them