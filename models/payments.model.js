const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const PaymentSchema = new mongoose.Schema({
  TraineeID: { type: ObjectId, ref: "Trainee", required: true },
  Amount: { type: Number, required: true },
  Status: { type: String, enum: ["Paid", "Pending"], required: true },
  DueDate: { type: Date, required: true },
  PaymentDate: { type: Date },
},
{
    timestamps: true 
}
);

module.exports = mongoose.model("Payment", PaymentSchema);
