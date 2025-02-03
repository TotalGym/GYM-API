const yup = require("yup");

exports.createPaymentValidation = {
  body: yup.object({
    TraineeID: yup.string().required("TraineeID is required"),
    Amount: yup
      .number()
      .positive("Amount must be a positive number")
      .required("Amount is required"),
    Status: yup
      .string()
      .oneOf(["Paid", "Pending"], "Invalid Status")
      .default("Paid"),
    DueDate: yup.date().optional(),
    PaymentDate: yup.date().optional(),
  }),
};

exports.updatePaymentValidation = {
  body: yup.object({
    TraineeID: yup.string().optional(),
    Amount: yup.number().positive("Amount must be a positive number").optional(),
    Status: yup.string().oneOf(["Paid", "Pending"], "Invalid Status").optional(),
    DueDate: yup.date().optional(),
    PaymentDate: yup.date().optional(),
  }),
};


exports.deletePaymentValidation = {
    params: yup.object({
      id: yup.string().required("Payment ID is required"),
    }),
  };