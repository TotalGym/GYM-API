const Notification = require("../models/notification.model.js");
const { paginatedResults } = require("../utils/pagination.js");
const { responseHandler } = require("../utils/responseHandler.js");
const { search } = require("../utils/search.js");

exports.createNotification = async (req, res) => {
  try {
    const { UserID, UserType, Type, Content, Date } = req.body;
    const notification = new Notification({ UserID, UserType, Type, Content, Date });
    await notification.save();
    responseHandler(res, 201, true, "Notification created successfully", savedNotification);
  } catch (err) {
    responseHandler(res, 500, false, "Failed to create notification", null, err.message);
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const searchQuery = search(Notification, searchTerm);

    const paginatedResponse = await paginatedResults(Notification, searchQuery, req);

    responseHandler(res, 200, true, "Notifications retrieved successfully", paginatedResponse);
  } catch (err) {
    responseHandler(res, 500, false, "Error retrieving notifications", null, err.message);
  }
};
// exports.getNotificationById = async (req, res) => {
//     const {id} = req.params;
//     try {
//       const notification = await Notification.findById(id);
//       if(!notification) return res.status(404).json({message: "Not Found"})
//       res.status(200).json(notification);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };

exports.getNotificationsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const notifications = await Notification.find({ Type: type });
    if (!notifications.length) {
      return responseHandler(res, 404, false, "No notifications found for this type");
    }
    responseHandler(res, 200, true, "Notifications retrieved successfully", notifications);
  } catch (err) {
    responseHandler(res, 500, false, "Error retrieving notifications by type", null, err.message);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return responseHandler(res, 404, false, "Notification not found");
    }

    responseHandler(res, 200, true, "Notification deleted successfully");
  } catch (err) {
    responseHandler(res, 500, false, "Error deleting notification", null, err.message);
  }
};
