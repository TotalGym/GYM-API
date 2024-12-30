const express = require('express');
const { createProgram, getPrograms, updateProgram, deleteProgram, getProgram } = require('../controllers/programs.controller.js');
const router = express.Router();

router.route('/')
    .post(createProgram)
    .get(getPrograms);

router.route('/:id')
    .put(updateProgram)
    .delete(deleteProgram)
    .get(getProgram);

module.exports = router;
