const express = require("express");
const router = express.Router();
const { AppHomePage } = require("../../controllers/home/app.controller");

router.get("/", AppHomePage);

module.exports = router;