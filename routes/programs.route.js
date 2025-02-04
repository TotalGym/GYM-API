const express = require('express');
const { createProgram, getPrograms, updateProgram, deleteProgram, getProgram, getProgramById, getProgramByName } = require('../controllers/programs.controller.js');
const router = express.Router();
const authorizeRole = require('../middlewares/authorize.middleware.js');
const validation = require("../middlewares/validate.middleware.js");
const { createProgramValidation, updateProgramValidation } = require('../utils/validators/program.validator.js');

router.route('/')
    .post(authorizeRole(["Admin", "SuperAdmin", "Coach"]), validation(createProgramValidation), createProgram)
    .get(getPrograms);
    
router.get('/program', getProgramByName);

router.route('/:id')
    .put(authorizeRole(["Admin", "SuperAdmin", "Coach"]), validation(updateProgramValidation), updateProgram)
    .delete(authorizeRole(["Admin", "SuperAdmin", "Coach"]), deleteProgram)
    .get(getProgramById);
    

module.exports = router;
