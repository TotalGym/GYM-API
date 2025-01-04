const express = require("express");
const { 
    createTrainee, 
    getTrainees, 
    getTraineeById, 
    updateTrainee, 
    deleteTrainee, 
    changePassword, 
    selectProgram 
} = require("../controllers/trainee.controller.js");
const {authenticate} = require("../middlewares/authenticate");
const authorizeRole = require("../middlewares/authorize.middleware.js");
const { paginatedResults } = require("../utils/pagination.js");
const traineeModel = require("../models/trainee.model.js");


const router = express.Router();

router.post("/", createTrainee);

router.get("/", paginatedResults(traineeModel), getTrainees);
router.get("/:id", getTraineeById);

router.put("/:id", updateTrainee); //Admin can't change all the data ? 
router.put("/changePassword/:id", authenticate, authorizeRole(["Trainee"]) , changePassword);
router.put("/:traineeId/select-program/:programId", selectProgram);

router.delete("/:id", deleteTrainee);

module.exports = router;
