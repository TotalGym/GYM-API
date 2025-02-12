const express = require("express");
const router = express.Router();
const routes = require("../../utils/split-routes/routes.js");
const authorizeRole = require("../../middlewares/authorize.middleware.js");
const { authenticate } = require("../../middlewares/authenticate.js");
const { getTraineeNotifications } = require("../../controllers/notification.controller.js");

router.use("/auth", routes.authRoutes);

router.use(authenticate);

router.use("/home", routes.appHome);
router.use("/trainee", authorizeRole(["Coach"]), routes.traineeRoutes);
router.use("/store", authorizeRole(["Trainee", "Coach"]), routes.storeRoutes);
router.use("/programs", authorizeRole(["Trainee", "Coach"]), routes.programsRoutes);
router.use("/profile", routes.profileRoutes);
router.use("/equipment", authorizeRole(["Coach"]), routes.equipmentRoutes);
router.use("/notification", authorizeRole(["Coach"]), routes.notificationRoutes);
router.use("/traineeNotifications", authorizeRole(["Trainee"]), getTraineeNotifications);

router.use('*', (req, res)=> {
    res.status(404).send("Page Not Found");
});

module.exports = router;
