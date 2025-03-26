const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateAdminProfile,
} = require("../controllers/profile.controller");

router.get("/", getProfile);
router.patch("/", updateProfile);
router.patch("/admin", updateAdminProfile);

module.exports = router;
