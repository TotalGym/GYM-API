const Program = require('../models/programs.model.js');
const { paginatedResults } = require('../utils/pagination.js');
const { search } = require('../utils/search.js');

const createProgram = async (req, res) => {
    const {programName, exercises, description, image, schedule, monthlyPrice } = req.body;
    const program = new Program({programName, exercises, description, image, schedule, monthlyPrice });
    try {
        const savedProgram = await program.save();
        res.status(201).json(savedProgram);
    } catch (error) {
        res.status(500).json({message: error.message});
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
        res.status(200).json(paginatedResponse);
      } catch (error) {
        res.status(500).json({ message: "Failed to retrieve programs", error: error.message });
      }
};

const getProgramById = async (req, res) => {
    const {id} = req.params;
    try {
        const program = await Program.findById(id);
        if(!program) return res.status(404).json({message: "Program Is not found"});
        res.status(200).json(program);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getProgramByName = async (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "Program name is required" });

    try {
        const program = await Program.findOne({ programName: { $regex: name, $options: 'i' } });
        if (!program) return res.status(404).json({ message: "Program not found" });

        res.status(200).json(program);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProgram = await Program.findByIdAndUpdate(id, req.body, { new: true });
        if(!updateProgram) return res.status(404).json({message: 'Program not found'})
        res.status(202).json(updatedProgram);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteProgram = async (req, res) => {
    const { id } = req.params;
    try {
        await Program.findByIdAndDelete(id);
        res.status(200).json({ message: 'Program deleted' });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = { createProgram, getPrograms, updateProgram, deleteProgram, getProgramById, getProgramByName};