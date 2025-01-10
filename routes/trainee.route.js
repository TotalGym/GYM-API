const express = require("express");
const { 
    createTrainee, 
    getTrainees, 
    getTraineeById, 
    updateTrainee, 
    deleteTrainee, 
    selectProgram 
} = require("../controllers/trainee.controller.js");

const authorizeRole = require("../middlewares/authorize.middleware.js");

const router = express.Router();

router.post("/",authorizeRole(["Admin", "SuperAdmin", "Coach"]), createTrainee);

router.get("/",  getTrainees);
router.get("/:id", getTraineeById);

router.put("/:id", updateTrainee); //Admin can't change all the data ? 
router.put("/:traineeId/select-program/:programId", selectProgram);

router.delete("/:id", deleteTrainee);

module.exports = router;
