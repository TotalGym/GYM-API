const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter a name"],
    minlength: [3,"Enter a valid name"]
  },
  email: {
    type: String,
    required: [true, "Email must be provided"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
  role: {
    type: String,
    enum: ["SuperAdmin", "Admin"],
    required: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Admin", adminSchema);
