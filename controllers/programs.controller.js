
const Program = require('../models/programs.model.js');

const createProgram = async (req, res) => {
    const {programName, exercises, description, image, schedule } = req.body;
    const program = new Program({programName, exercises, description, image, schedule });
    try {
        const savedProgram = await program.save();
        res.status(201).json(savedProgram);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getPrograms = async (req, res) => {
    try {
        const programs = await Program.find().populate('registeredTrainees');
        // const programs = await Program.find();

        res.status(200).json(programs);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Get one program
const getProgram = async (req, res) => {
    const {id} = req.params;
    try {
        const program = await Program.findById(id);
        if(!program) return res.status(404).json({message: "Program Is not found"});
        res.status(200).json(program);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Update Program
const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProgram = await Program.findByIdAndUpdate(id, req.body, { new: true });
        if(!updateProgram) return res.status(404).json({message: 'Program not found'})  //todo: validation for the routes data
        res.status(202).json(updatedProgram);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Delete Program
const deleteProgram = async (req, res) => {
    const { id } = req.params;
    try {
        await Program.findByIdAndDelete(id);
        res.status(200).json({ message: 'Program deleted' });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = { createProgram, getPrograms, updateProgram, deleteProgram, getProgram};