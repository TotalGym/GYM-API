const express = require("express");
const router = express.Router();
const {
  createNotification,
  getAllNotifications,
  getNotificationsByType,
  deleteNotification,
} = require("../controllers/notification.controller.js");
const authorizeRole = require("../middlewares/authorize.middleware.js");
const validate = require("../middlewares/validate.middleware.js");

router.post("/",
  authorizeRole(["SuperAdmin" , "Admin" , "Coach", "EquipmentManager" , "SalesManager"]), 
  validate(createNotificationValidation),
  createNotification
);

router.get("/", authorizeRole(["SuperAdmin" , "Admin" , "Coach", "EquipmentManager" , "SalesManager"]), getAllNotifications);
router.get("/:type", authorizeRole(["SuperAdmin" , "Admin" , "Coach", "EquipmentManager" , "SalesManager"]), getNotificationsByType);
router.delete("/:id", authorizeRole(["SuperAdmin" , "Admin" , "Coach", "EquipmentManager" , "SalesManager"]), deleteNotification);

module.exports = router;
