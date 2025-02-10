const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./dashboard.routes");
const appRoutes = require("./app.routes");

// Separate base paths
router.use("/dashboard", dashboardRoutes);
router.use("/app", appRoutes);

module.exports = router;