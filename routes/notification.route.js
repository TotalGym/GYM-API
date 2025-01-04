const express = require("express");
const router = express.Router();
const {
  createNotification,
  getAllNotifications,
  getNotificationsByType,
  deleteNotification,
} = require("../controllers/notification.controller.js");
const authorizeRole = require("../middlewares/authorize.middleware.js");

router.post("/", authorizeRole(["SuperAdmin" , "Admin" , "Coach"]), createNotification);
router.get("/", authorizeRole(["SuperAdmin" , "Admin" , "Coach"]), getAllNotifications);
router.get("/:type", authorizeRole(["SuperAdmin" , "Admin" , "Coach"]), getNotificationsByType);
router.delete("/:id", authorizeRole(["SuperAdmin" , "Admin" , "Coach"]), deleteNotification);

module.exports = router;
