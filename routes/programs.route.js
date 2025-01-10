const express = require('express');
const { createProgram, getPrograms, updateProgram, deleteProgram, getProgram } = require('../controllers/programs.controller.js');
const router = express.Router();
const authorizeRole = require('../middlewares/authorize.middleware.js');

router.route('/')
    .post(authorizeRole(["Admin", "SuperAdmin", "Coach"]) ,createProgram)
    .get(getPrograms);

router.route('/:id')
    .put(authorizeRole(["Admin", "SuperAdmin", "Coach"]), updateProgram)
    .delete(authorizeRole(["Admin", "SuperAdmin", "Coach"]), deleteProgram)
    .get(getProgram);

module.exports = router;
