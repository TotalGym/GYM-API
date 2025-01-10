const {paginatedResults} = require("../utils/pagination.js");
const bcrypt = require("bcrypt");
const Trainee = require("../models/trainee.model.js");
const Program = require("../models/programs.model.js");

const {search} = require("../utils/search.js");

exports.createTrainee = async (req, res) => {
  try {
    const trainee = new Trainee(req.body);
    await trainee.save();
    res.status(201).json(trainee);
  } catch (error) {
    res.status(400).json({ message: "Error creating trainee " + error.message });
  }
};


exports.selectProgram = async (req, res) => {
  const { traineeId, programId } = req.params;

  try {
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const trainee = await Trainee.findById(traineeId);
    if (!trainee) {
      return res.status(404).json({ message: "Trainee not found" });
    }
    if (trainee.selectedPrograms.includes(programId)) {
      return res.status(400).json({ message: "Trainee is already enrolled in this program" });
    }

    trainee.selectedPrograms.push(programId);

    await trainee.save();

    program.registeredTrainees.push(traineeId);
    await program.save();

    res.status(200).json({ message: "Program selected successfully", trainee });
  } catch (error) {
    res.status(500).json({ message: "Error selecting program " + error.message });
  }
};


exports.getTrainees = async (req, res) => {
  try {
    const searchQuery = search(Trainee, req.query.search);
    const response = await paginatedResults(Trainee, searchQuery, req, {
      populateFields: [
        { path: 'selectedPrograms', select: 'programName monthlyPrice' },
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error: +_+ " + error.message });
  }
};

exports.getTraineeById = async (req, res) => {
    const {id} = req.params;
    try {
      const trainee = await Trainee.findById(id).populate({ path: "selectedPrograms", select: "programName" });
      if(!trainee) return res.status(404).json({message:"Trainee Not found"});
      res.status(200).json(trainee);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trainees " + error.message });
    }
  };


exports.updateTrainee = async (req, res) => { // Make sure that the admin can't changhe all the data
  try {
    const trainee = await Trainee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trainee) return res.status(404).json({ message: "Trainee not found" });
    res.status(200).json(trainee);
  } catch (error) {
    res.status(400).json({ message: "Error updating trainee " + error.message });
  }
};

exports.deleteTrainee = async (req, res) => {
  try {
    const trainee = await Trainee.findByIdAndDelete(req.params.id);
    if (!trainee) return res.status(404).json({ message: "Trainee not found" });
    res.status(200).json({ message: "Trainee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trainee - " + error.message });
  }
};
