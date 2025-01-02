const paginatedResults = require("../middlewares/pagination.js");
const Trainee = require("../models/trainee.model.js");
const bcrypt = require("bcrypt");


exports.createTrainee = async (req, res) => {
  try {
    const trainee = new Trainee(req.body);
    await trainee.save();
    res.status(201).json(trainee);
  } catch (error) {
    res.status(400).json({ message: "Error creating trainee " + error.message });
  }
};

exports.getTrainees = async (req, res) => {
  try {
    res.status(200).json(res.paginatedResults); // edit !

  } catch (error) {
    res.status(500).json({ message: "Error fetching trainees " + error.message });
  }
};

exports.getTraineeById = async (req, res) => {
    const {id} = req.params;
    try {
      const trainee = await Trainee.findById(id);
      if(!trainee) return res.status(404).json({message:"Trainee Not found"});
      res.status(200).json(trainee);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trainees " + error.message });
    }
  };


exports.updateTrainee = async (req, res) => {
  try {
    const trainee = await Trainee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trainee) return res.status(404).json({ message: "Trainee not found" });
    res.status(200).json(trainee);
  } catch (error) {
    res.status(400).json({ message: "Error updating trainee " + error.message });
  }
};

exports.changePassword = async (req, res) => {

  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const trainee = await Trainee.findById(id);
    if (!trainee) return res.status(404).json({ message: "Trainee not found" });

    const isMatch = await bcrypt.compare(oldPassword, trainee.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    trainee.password = newPassword;
    await trainee.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password - " + error.message });
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
