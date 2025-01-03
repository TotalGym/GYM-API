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

router.post("/", authorizeRole(["Admin", "SuperAdmin"]), createPayment);
router.get("/", authorizeRole(["Admin", "SuperAdmin"]), getAllPayments);
router.get("/:id", authorizeRole(["Admin", "SuperAdmin"]), getPaymentById);
router.put("/:id", authorizeRole(["Admin", "SuperAdmin"]), updatePayment);
router.delete("/:id", authorizeRole(["SuperAdmin"]), deletePayment);

module.exports = router;
