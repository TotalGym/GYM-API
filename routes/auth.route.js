const express = require("express");
const {login, changePassword, forgotPassword, verifyResetCode, resetPassword, getLoggedUser, checkAuth, refreshToken} = require("../controllers/auth/auth.controller.js");
const { authenticate } = require("../middlewares/authenticate.js");
const validation = require("../middlewares/validate.middleware.js");
const { loginValidation, changePasswordValidation, forgotPasswordValidation, verifyResetCodeValidation, resetPasswordValidation } = require("../utils/validators/auth.validator.js");

const router = express.Router();


router.post("/login", validation(loginValidation) ,login);
router.put("/changePassword/:id", validation(changePasswordValidation), authenticate, changePassword);
router.post("/forgot-password", validation(forgotPasswordValidation), forgotPassword);
router.post("/verify", validation(verifyResetCodeValidation), verifyResetCode);
router.put("/reset-password", validation(resetPasswordValidation), resetPassword);

router.get("/user", authenticate, getLoggedUser);
router.get("/check-auth", authenticate, checkAuth);

router.use("*", (req, res) => {
    res.status(404).json({ message: "Page Not Found" });
});

module.exports = router;