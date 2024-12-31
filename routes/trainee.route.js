const express = require("express");
const { createTrainee, getTrainees, getTraineeById, updateTrainee, deleteTrainee, changePassword } = require("../controllers/trainee.controller.js");
const authenticate = require("../middlewares/authenticate");
const authorizeRole = require("../middlewares/authorize.middleware.js");

const router = express.Router();

router.post("/", createTrainee);
router.get("/", getTrainees);
router.get("/:id", getTraineeById);
router.put("/:id", updateTrainee); //note that the admin can't change all the data ?? 
router.put("/:id/changePassword", authorizeRole(["Trainee"]) , changePassword);
router.delete("/:id", deleteTrainee);

module.exports = router;
