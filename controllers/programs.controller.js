const Program = require('../models/programs.model.js');
const { paginatedResults } = require('../utils/pagination.js');
const { responseHandler } = require('../utils/responseHandler.js');
const { search } = require('../utils/search.js');

const createProgram = async (req, res) => {
    const {programName, exercises, description, image, schedule, monthlyPrice, annuallyPrice } = req.body;
    const program = new Program({programName, exercises, description, image, schedule, monthlyPrice, annuallyPrice });
    try {
        const savedProgram = await program.save();
        responseHandler(res, 201, true, "Program created successfully", savedProgram);
    } catch (error) {
        responseHandler(res, 500, false, "Failed to create program", null, error.message);
    }
};

const getPrograms = async (req, res) => {
    try {
        const searchTerm = req.query.search || '';
        const searchQuery = search(Program, searchTerm);
        const paginatedResponse = await paginatedResults(Program, searchQuery, req, {
            populateFields: [
              { path: 'registeredTrainees', select: 'name' },
            ],
          });
        
        responseHandler(res, 200, true, "Programs retrieved successfully", paginatedResponse);
        } catch (error) {
        responseHandler(res, 500, false, "Failed to retrieve programs", null, error.message);
        }
};

const getProgramById = async (req, res) => {
    const {id} = req.params;
    try {
        const program = await Program.findById(id);
        if (!program) return responseHandler(res, 404, false, "Program not found");

        responseHandler(res, 200, true, "Program retrieved successfully", program);
    } catch (error) {
        responseHandler(res, 500, false, "Failed to retrieve program", null, error.message);
    }
};

const getProgramByName = async (req, res) => {
    const { name } = req.params;
    if (!name) return responseHandler(res, 400, false, "Program name is required");

    try {
        const program = await Program.findOne({ programName: { $regex: name, $options: 'i' } });
        if (!program) return responseHandler(res, 404, false, "Program not found");

        responseHandler(res, 200, true, "Program retrieved successfully", program);
    } catch (error) {
        responseHandler(res, 500, false, "Failed to retrieve program", null, error.message);
    }
};

const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProgram = await Program.findByIdAndUpdate(id, req.body, { new: true, runValidators: true } );
        if (!updatedProgram) return responseHandler(res, 404, false, "Program not found");

        responseHandler(res, 202, true, "Program updated successfully", updatedProgram);
    } catch (error) {
        responseHandler(res, 500, false, "Failed to update program", null, error.message);
    }
};

const deleteProgram = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProgram = await Program.findByIdAndDelete(id);
        if (!deletedProgram) return responseHandler(res, 404, false, "Program not found");

        responseHandler(res, 200, true, "Program deleted successfully");
    } catch (error) {
        responseHandler(res, 500, false, "Failed to delete program", null, error.message);
    }
};

module.exports = { createProgram, getPrograms, updateProgram, deleteProgram, getProgramById, getProgramByName};