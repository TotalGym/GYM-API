const express = require("express");
const router = express.Router();

const {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/admin.controller.js");

// const authorizeRole = require("../middlewares/authorize.middleware.js");


router.get("/", getAdmins);
router.post("/", createAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;


//todo : check the user stories for the admin and apply them