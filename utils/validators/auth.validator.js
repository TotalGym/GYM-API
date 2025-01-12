const yup = require("yup");

const loginValidation = {
  body: yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  }),
};

const changePasswordValidation = {
  params: yup.object({
    id: yup.string().required("User ID is required"),
  }),
  body: yup.object({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup
      .string()
      .min(6, "New password must be at least 6 characters")
      .required("New password is required"),
  }),
};

const forgotPasswordValidation = {
  body: yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
};

const verifyResetCodeValidation = {
  body: yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
    otp: yup
      .string()
      .length(6, "OTP must be exactly 6 characters")
      .required("OTP is required"),
  }),
};

const resetPasswordValidation = {
  body: yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
    newPassword: yup
      .string()
      .min(6, "New password must be at least 6 characters")
      .required("New password is required"),
  }),
};

module.exports = {
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  verifyResetCodeValidation,
  resetPasswordValidation,
};
