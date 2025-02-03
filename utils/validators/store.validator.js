const yup = require("yup");

exports.createProductValidation = {
  body: yup.object({
    productName: yup.string().required("Product name is required"),
    description: yup.string().optional(),
    image: yup.string().required("Product image is required"),
    inventoryCount: yup
      .number()
      .required("Inventory count is required")
      .min(0, "Inventory count cannot be negative"),
  }),
};

exports.updateProductValidation = {
  body: yup.object({
    productName: yup.string().optional(),
    description: yup.string().optional(),
    image: yup.string().optional(),
    inventoryCount: yup
      .number()
      .optional()
      .min(0, "Inventory count cannot be negative"),
  }),
};
