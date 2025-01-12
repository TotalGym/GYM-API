const yup = require("yup");

const createEquipmentValidation = {
  body: yup.object({
    name: yup.string()
      .required("Equipment name is required"),
    type: yup.string()
      .required("Equipment type is required"),
    quantity: yup.number()
      .min(1, "Quantity must be at least 1")
      .required("Quantity is required"),
    image: yup.string()
      .url("Image must be a valid URL")
      .required("Image is required"),
    status: yup.string()
      .oneOf(["Available", "In Use", "Under Maintenance"], "Invalid status")
      .required("Status is required"),
  }),
};

const updateEquipmentValidation = {
  body: yup.object({
    name: yup.string(),
    type: yup.string(),
    quantity: yup.number().min(1, "Quantity must be at least 1"),
    image: yup.string().url("Image must be a valid URL"),
    status: yup.string().oneOf(["Available", "In Use", "Under Maintenance"], "Invalid status"),
  }),
  params: yup.object({
    id: yup.string().required("Equipment ID is required"),
  }),
};

const getEquipmentByIdValidation = {
  params: yup.object({
    id: yup.string().required("Equipment ID is required"),
  }),
};

const deleteEquipmentValidation = {
  params: yup.object({
    id: yup.string().required("Equipment ID is required"),
  }),
};

module.exports = {
  createEquipmentValidation,
  updateEquipmentValidation,
  getEquipmentByIdValidation,
  deleteEquipmentValidation,
};
