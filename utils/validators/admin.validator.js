const yup = require("yup");

const createAdminValidation = {
  body: yup.object({
    name: yup.string()
      .min(2, "Name must be at least 2 characters long")
      .required("Name is required"),
    email: yup.string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    role: yup.string()
      .oneOf(["SuperAdmin", "Admin", "super admin", "admin", "superadmin"], "Role must be either 'SuperAdmin' or 'Admin'")
      .required("Role is required"),
  }),
};

const updateAdminValidation = {
  body: yup.object({
    name: yup.string().min(3, "Name must be at least 3 characters long"),
    email: yup.string().email("Must be a valid email"),
    password: yup.string().min(6, "Password must be at least 6 characters long"),
    role: yup.string().oneOf(["SuperAdmin", "Admin"], "Role must be either 'SuperAdmin' or 'Admin'"),
  }),
  params: yup.object({
    id: yup.string().required("Admin ID is required"),
  }),
};

const deleteAdminValidation = {
  params: yup.object({
    id: yup.string().required("Admin ID is required"),
  }),
};

module.exports = {
  createAdminValidation,
  updateAdminValidation,
  deleteAdminValidation,
};
