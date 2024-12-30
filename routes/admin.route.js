const express = require("express");
const router = express.Router();

const {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/admin.controller.js");

const authorizeRole = require("../middlewares/authorize.middleware.js");


router.get("/", authorizeRole(["SuperAdmin"]), getAdmins);
router.post("/", authorizeRole(["SuperAdmin"]), createAdmin);
router.put("/:id", authorizeRole(["SuperAdmin"]), updateAdmin);
router.delete("/:id", authorizeRole(["SuperAdmin"]), deleteAdmin);

module.exports = router;


//todo : check the user stories for the admin and apply them