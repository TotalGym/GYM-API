const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Type: { type: String, enum: ["Trainee", "Staff", "Store", "Sales", "Equipments", "Payments", "Programs"], required: true },
  DataPoints: { type: Map, of: String },
  Date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Report", ReportSchema);
