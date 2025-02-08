const express = require("express");
const router = express.Router();
const routes = require("../../utils/split-routes/routes.js");
const authorizeRole = require("../middlewares/authorize.middleware.js");
const { authenticate } = require("../../middlewares/authenticate.js");

router.use("/auth", routes.authRoutes);

router.use(authenticate);

router.use("/home", routes.appHome);
router.use("/trainee", authorizeRole(["Trainee"]), routes.traineeRoutes);
router.use("/store", authorizeRole(["Trainee", "Coach"]), routes.storeRoutes);
router.use("/programs", authorizeRole(["Trainee", "Coach"]), routes.programsRoutes);

router.use("/equipment", authorizeRole(["Coach"]), routes.equipmentRoutes);
router.use("/notification", authorizeRole(["Trainee", "Coach"]), routes.notificationRoutes);

module.exports = router;
