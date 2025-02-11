const Payment = require("../models/payments.model.js");
const Trainee = require("../models/trainee.model.js");
const { paginatedResults } = require("../utils/pagination.js");
const { responseHandler } = require("../utils/responseHandler.js");
const { search } = require("../utils/search.js");


exports.createPayment = async (req, res) => {
  try {
    const { TraineeID, Amount, Status } = req.body;

    const trainee = await Trainee.findById(TraineeID);
    if (!trainee) return responseHandler(res, 404, false, "Trainee not found");

    const PaymentDate = new Date();
    const DueDate = trainee.membership?.endDate || PaymentDate;

    const payment = new Payment({ TraineeID, Amount, Status, DueDate, PaymentDate });
    const savedPayment = await payment.save();

    const currentEndDate = trainee.membership?.endDate 
      ? new Date(trainee.membership.endDate) 
      : new Date();

    const updatedEndDate = new Date(currentEndDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    trainee.membership.endDate = updatedEndDate.toISOString();
    await trainee.save();

    responseHandler(res, 201, true, "Payment created successfully", savedPayment);
  } catch (error) {
    responseHandler(res, 500, false, "Failed to create payment", null, error.message);
  }
};


exports.getAllPayments = async (req, res) => {
  try{
    const searchTerm = req.query.search || '';
    const searchQuery = search(Payment, searchTerm);
    const paginatedResponse = await paginatedResults(Payment, searchQuery, req, {
      populateFields: [{  path: 'TraineeID', select: 'name contact'}],
    });
    responseHandler(res, 200, true, "Payments retrieved successfully", paginatedResponse);
   } catch (error) {
    responseHandler(res, 500, false, "Failed to retrieve payments", null, error.message);
   }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("TraineeID", "name contact");
    if (!payment) return responseHandler(res, 404, false, "Payment not found");

    responseHandler(res, 200, true, "Payment retrieved successfully", payment);
  } catch (error) {
    responseHandler(res, 500, false, "Failed to retrieve payment", null, error.message);
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedPayment) return responseHandler(res, 404, false, "Payment not found");

    responseHandler(res, 202, true, "Payment updated successfully", updatedPayment);
  } catch (error) {
    responseHandler(res, 500, false, "Failed to update payment", null, error.message);
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) return responseHandler(res, 404, false, "Payment not found");

    responseHandler(res, 200, true, "Payment deleted successfully");
  } catch (error) {
    responseHandler(res, 500, false, "Failed to delete payment", null, error.message);
  }
};
