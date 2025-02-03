const express = require("express");
const router = express.Router();
const authorizeRole = require("../middlewares/authorize.middleware");
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controllers/payments.controller.js");
const validation = require("../middlewares/validate.middleware.js");
const { createPaymentValidation, updatePaymentValidation, deletePaymentValidation } = require("../utils/validators/payment.validator.js");

router.post("/", 
  authorizeRole(["Admin", "SuperAdmin"]), 
  validation(createPaymentValidation),
  createPayment
);

router.get("/", authorizeRole(["Admin", "SuperAdmin"]), getAllPayments);
router.get("/:id", authorizeRole(["Admin", "SuperAdmin"]), getPaymentById);

router.put("/:id", 
  authorizeRole(["Admin", "SuperAdmin"]), 
  validation(updatePaymentValidation),
  updatePayment
);
router.delete("/:id", 
  authorizeRole(["SuperAdmin"]), 
  validation(deletePaymentValidation),
  deletePayment
);

module.exports = router;
