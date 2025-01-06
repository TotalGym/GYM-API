const express = require("express");
const {login, changePassword} = require("../controllers/auth/auth.controller.js");
const { authenticate } = require("../middlewares/authenticate.js");
const authorizeRole = require("../middlewares/authorize.middleware.js");

const router = express.Router();


router.post("/login", login);
router.put("/changePassword/:id", authenticate, authorizeRole(["Trainee" , "Admin" , "SuperAdmin"]) , changePassword);


module.exports = router;