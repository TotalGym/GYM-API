const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const notificationSchema = new mongoose.Schema({
  UserID: { type: ObjectId, required: true },
  UserType: { type: String, required: [true, "User role must be added"] },
  Type: { type: String, enum: ["Alert", "Reminder", "Message"], required: true },
  Content: { type: String, required: [true, "Provide the Notification Message"] },
  Date: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Notification", notificationSchema);