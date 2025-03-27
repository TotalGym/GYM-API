const express = require("express");
const router = express.Router();
const storeController = require("../controllers/store.controller");
const validation = require("../middlewares/validate.middleware");
const {
  createProductValidation,
  updateProductValidation,
} = require("../utils/validators/store.validator");
const authorizeRole = require("../middlewares/authorize.middleware");

router.get("/", storeController.getProducts);
router.get("/:id", storeController.getProduct);
router.post(
  "/",
  validation(createProductValidation),
  authorizeRole(["Admin", "SuperAdmin", "Coach"]),
  storeController.addProduct
);
router.put(
  "/:id",
  validation(updateProductValidation),
  authorizeRole(["Admin", "SuperAdmin", "Coach"]),
  storeController.updateProduct
);
router.delete(
  "/:id",
  authorizeRole(["Admin", "SuperAdmin", "Coach"]),
  storeController.deleteProduct
);

module.exports = router;
