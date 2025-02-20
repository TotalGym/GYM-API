const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const traineeSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please Add a name"], minlength:[2, "Please Enter a valid name"] },
  contact: {
    email: { type: String, required: [true, "You must add an email"], lowercase:true },
    phoneNumber: { type: String, required: [true, "Phone Number must be added"], minlength:[6, "Enter a valid Phone Number"] },
  },
  role: {type: String, required: true, default: "Trainee"},
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
  gender: { type: String, enum: ["Male", "Female"], required: true },
  membership: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  attendance: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ["Present", "Absent"], required: true },
    },
  ],
  selectedPrograms: [{ type: ObjectId, ref: "Program" }],
  subscriptionType: {type: String, enum: ["monthly", "annually"], required: [false, "Add a Subscription Type"]}, //false for now
  assignedCoach: [{ type: ObjectId, ref: "Staff", default: null }],
  status: { type: String, enum: ["new", "active", "inactive"], default:"new" },
  progress: {
    milestones: [String],
    metrics: { type: Map, of: String },
  },
  paymentVerification: {type: Boolean, required: [false, "Payment status"]} // for dashboard only,
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Trainee", traineeSchema);