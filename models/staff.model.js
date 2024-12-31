const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name must be proided"] },
  role: { type: String, required: [true, "Provide the role for this staff"] }, // e.g., 'EquipmentManager', 'TraineeCoach'
  contact: {
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true }
  },
  attendance: [
    {
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ["Present", "Absent", "On Leave"], required: true }
    }
  ],
  payroll: {
    salary: { type: Number, required: true },
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    payDate: { type: Date }
  }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Staff", staffSchema);
