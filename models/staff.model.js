const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name must be proided"] },
  role: { 
    type: String, 
    required: [true, "Provide the role for this staff"],
    enum: ["Coach" , "EquipmentManager" , "SalesManager"],
  },
  contact: {
    email: { type: String, required: true, unique: true, lowercase:true },
    phoneNumber: { type: String, required: true }
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters"],
    required: [true, "Paessword is requierd"],
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
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

staffSchema.pre("save", async function (next) {
  if (!this.password) {
    this.password = this.contact.phoneNumber;
  }

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Staff", staffSchema);
