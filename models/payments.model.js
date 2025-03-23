const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const PaymentSchema = new mongoose.Schema(
  {
    TraineeID: { type: ObjectId, ref: "Trainee", required: true },
    ProgramID: { type: ObjectId, ref: "Program", required: true },
    Status: {
      type: String,
      enum: ["Paid", "Pending"],
      required: true,
      default: "Paid",
    },
    DueDate: { type: Date, required: true },
    PaymentDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);
