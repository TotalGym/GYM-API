const Payment = require("../models/payments.model.js");
const Trainee = require("../models/trainee.model.js");

exports.createPayment = async (req, res) => {
  try {
    const { TraineeID, Amount, Status, DueDate, PaymentDate } = req.body;

    const trainee = await Trainee.findById(TraineeID);
    if (!trainee) return res.status(404).json({ message: "Trainee not found" });

    const payment = new Payment({ TraineeID, Amount, Status, DueDate, PaymentDate });
    const savedPayment = await payment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment", error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("TraineeID", "name contact");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve payments", error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("TraineeID", "name contact");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve payment", error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPayment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment", error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete payment", error: error.message });
  }
};
