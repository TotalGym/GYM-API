const yup = require("yup");

exports.createStaffValidation = {
  body: yup.object({
    name: yup.string().required("Name is required"),
    role: yup
      .string()
      .oneOf(["Coach", "EquipmentManager", "SalesManager",
              "coach", "equipment manager", "sales manager",
            "coach", "equipmentmanager", "salesmanager"],
      "Invalid role")
      .required("Role is required"),
    contact: yup.object({
      email: yup.string().email("Invalid email format").required("Email is required"),
      phoneNumber: yup.string().required("Phone number is required"),
    }),
    password: yup.string().min(6, "Password must be at least 6 characters"),
    payroll: yup.object({
      salary: yup.number().optional().default(0),
      bonus: yup.number().default(0),
      deductions: yup.number().default(0),
      payDate: yup.date().optional(),
    }).optional(),
  }),
};

exports.updateStaffValidation = {
  body: yup.object({
    name: yup.string().optional(),
    role: yup.string().oneOf(["Coach", "EquipmentManager", "SalesManager"], "Invalid role"),
    contact: yup.object({
      email: yup.string().email("Invalid email format").optional(),
      phoneNumber: yup.string().optional(),
    }).optional(),
    payroll: yup.object({
      salary: yup.number().optional(),
      bonus: yup.number().default(0),
      deductions: yup.number().default(0),
      payDate: yup.date().optional(),
    }).optional(),
  }),
};

exports.updatePayrollValidation = {
  body: yup.object({
    salary: yup.number().required("Salary is required"),
    bonus: yup.number().default(0),
    deductions: yup.number().default(0),
    payDate: yup.date().optional(),
  }),
};
