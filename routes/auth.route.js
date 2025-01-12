const express = require("express");
const {login, changePassword, forgotPassword, verifyResetCode, resetPassword} = require("../controllers/auth/auth.controller.js");
const { authenticate } = require("../middlewares/authenticate.js");
const validate = require("../middlewares/validate.middleware.js");
const { loginValidation, changePasswordValidation, forgotPasswordValidation, verifyResetCodeValidation, resetPasswordValidation } = require("../utils/validators/auth.validator.js");

const router = express.Router();


router.post("/login", validate(loginValidation) ,login);
router.put("/changePassword/:id", validate(changePasswordValidation), authenticate, changePassword);
router.post("/forgot-password", validate(forgotPasswordValidation), forgotPassword);
router.post("/verify",validate(verifyResetCodeValidation), verifyResetCode);
router.put("/reset-password",validate(resetPasswordValidation), resetPassword);


module.exports = router;