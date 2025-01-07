const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ObjectId = mongoose.Schema.Types.ObjectId;

const traineeSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please Add a name"], minlength:[2, "Please Enter a valid name"] },
  contact: {
    email: { type: String, required: [true, "You must add an email"] },
    phoneNumber: { type: String, required: [true, "Phone Number must be added"], minlength:[6, "Enter a valid Phone Number"] },
  },
  role: {type: String, required: true, default: "Trainee"},
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
    default: function () {
      return this.contact.phoneNumber;
    },
  },
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
  progress: {
    milestones: [String],
    metrics: { type: Map, of: String },
  },
},
{
  timestamps: true,
}
);


traineeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Trainee", traineeSchema);
