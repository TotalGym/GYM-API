const express = require("express");
const router = express.Router();
const { dashboardHomePage } = require("../../controllers/home/dashboard.controller");

router.get("/", dashboardHomePage);

module.exports = router;
