const yup = require("yup");

exports.createNotificationValidation = {
  body: yup.object({
    UserID: yup.string().required("UserID is required"),
    UserType: yup.string().required("UserType is required"),
    Type: yup
      .string()
      .oneOf(["Alert", "Reminder", "Message"], "Invalid Type")
      .required("Type is required"),
    Content: yup.string().required("Content is required"),
    Date: yup.date().optional(),
  }),
};
