const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profile.controllers");

router.get("/", getProfile);
router.patch("/", updateProfile);


module.exports = router;