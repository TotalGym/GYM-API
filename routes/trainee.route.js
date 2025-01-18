const express = require("express");
const { 
    createTrainee, 
    getTrainees, 
    getTraineeById, 
    updateTrainee, 
    deleteTrainee, 
    selectProgram, 
    changeProgram
} = require("../controllers/trainee.controller.js");

const authorizeRole = require("../middlewares/authorize.middleware.js");

const router = express.Router();

router.post("/",authorizeRole(["Admin", "SuperAdmin", "Coach"]), createTrainee);

router.get("/",  getTrainees);
router.get("/:id", getTraineeById);

router.put("/:id", authorizeRole(["Admin", "SuperAdmin"]), updateTrainee);
router.put("/:traineeId/select-program/:programId", authorizeRole(["Admin", "SuperAdmin", "Coach"]), selectProgram);
router.put("/:traineeId/change-program/:programId", authorizeRole(["Admin", "SuperAdmin", "Coach"]), changeProgram);

router.delete("/:id",authorizeRole(["Admin", "SuperAdmin"]), deleteTrainee);

module.exports = router;
