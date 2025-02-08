const express = require("express");
const router = express.Router();
const routes = require("../../utils/split-routes/routes.js");
const authorizeRole = require("../../middlewares/authorize.middleware.js");
const { authenticate } = require("../../middlewares/authenticate.js");

router.use("/auth", routes.authRoutes);

router.use(authenticate);

app.use("/home", routes.dashboardHome);
router.use("/admin", authorizeRole(["SuperAdmin"]), routes.adminRoutes);
router.use("/staff", authorizeRole(["SuperAdmin", "Admin"]), routes.staffRoutes);
router.use("/payments", authorizeRole(["SuperAdmin", "Admin"]), routes.paymentRoutes);
router.use("/report", authorizeRole(["SuperAdmin", "Admin"]), routes.reportRoutes);
router.use("/trainee", authorizeRole(["SuperAdmin", "Admin", "Coach"]), routes.traineeRoutes);
router.use("/equipment", authorizeRole(["SuperAdmin", "Admin", "EquipmentManager"]), routes.equipmentRoutes);
router.use("/store", authorizeRole(["SuperAdmin", "Admin", "SalesManager"]), routes.storeRoutes);
router.use("/sales", authorizeRole(["SuperAdmin", "Admin", "SalesManager"]), routes.salesHistoryRoutes);
router.use("/programs", authorizeRole(["SuperAdmin", "Admin", "Coach"]), routes.programsRoutes);
router.use("/notification", authorizeRole(["SuperAdmin", "Admin"]), routes.notificationRoutes);

module.exports = router;
