const express = require("express");
const {login, changePassword, forgotPassword, verifyResetCode, resetPassword} = require("../controllers/auth/auth.controller.js");
const { authenticate } = require("../middlewares/authenticate.js");
const { loginValidation, changePasswordValidation, forgotPasswordValidation, verifyResetCodeValidation, resetPasswordValidation } = require("../utils/validators/auth.validator.js");

const router = express.Router();


router.post("/login", loginValidation ,login);
router.put("/changePassword/:id", changePasswordValidation, authenticate, changePassword);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/verify", verifyResetCodeValidation, verifyResetCode);
router.put("/reset-password", resetPasswordValidation, resetPassword);


module.exports = router;