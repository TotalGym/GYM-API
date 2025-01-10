const Notification = require("../models/notification.model.js");
const { paginatedResults } = require("../utils/pagination.js");
const { search } = require("../utils/search.js");

exports.createNotification = async (req, res) => {
  try {
    const { UserID, UserType, Type, Content, Date } = req.body;
    const notification = new Notification({ UserID, UserType, Type, Content, Date });
    await notification.save();
    res.status(201).json({ message: "Notification created", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const searchQuery = search(Notification, searchTerm);

    const paginatedResponse = await paginatedResults(Notification, searchQuery, req);

    res.status(200).json(paginatedResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
