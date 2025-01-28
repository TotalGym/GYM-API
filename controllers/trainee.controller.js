const {paginatedResults} = require("../utils/pagination.js");
const bcrypt = require("bcrypt");
const Trainee = require("../models/trainee.model.js");
const Program = require("../models/programs.model.js");

const {search} = require("../utils/search.js");

exports.createTrainee = async (req, res) => {
  try {
    const {
      name,
      contact,
      gender,
      membership: { startDate } = {},
      subscriptionType,
      password,
      selectedPrograms = [],
    } = req.body;

    const existingTrainee = await Trainee.findOne({ "contact.email": contact.email });
    if (existingTrainee) {
      return res
        .status(400)
        .json({ message: "Email is already in use by another trainee." });
    }

    if (!name || !contact || !gender || !startDate || !subscriptionType) {
      return res.status(400).json({
        message:
          "Missing required fields: name, contact, gender, startDate, or subscriptionType or mandatory.",
      });
    }

    if (!contact.email || !contact.phoneNumber) {
      return res
        .status(400)
        .json({ message: "Contact must include email and phone number." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let endDate;
    const start = new Date(startDate);

    if (subscriptionType === "monthly") {
      endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (subscriptionType === "annually") {
      endDate = new Date(start);
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      return res.status(400).json({
        message: "Invalid subscriptionType. Must be either 'monthly' or 'annually'.",
      });
    }

    const trainee = new Trainee({
      name,
      contact,
      gender,
      membership: { startDate, endDate },
      selectedPrograms,
      subscriptionType,
      password: hashedPassword,
    });

    await trainee.save();
    res.status(201).json(trainee);
  
  } catch (error) {
    res.status(400).json({ message: `Error creating trainee: ${error.message}` });
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

    if (trainee.selectedPrograms.some(p => p.programId === programId)) {
      return res.status(400).json({ message: "Trainee is already enrolled in this program" });
    }

    trainee.selectedPrograms.push({
      programId,
      enrollmentDate: new Date(),
    });

    await trainee.save();

    program.registeredTrainees.push(traineeId);
    await program.save();

    res.status(200).json({ message: "Program selected successfully", trainee });
  } catch (error) {
    res.status(500).json({ message: "Error selecting program: " + error.message });
  }
};

exports.changeProgram = async (req, res) => {
  const { traineeId, oldProgramId } = req.params;
  const { newProgramName } = req.body;

  try {
    const trainee = await Trainee.findById(traineeId);
    if (!trainee) {
      return res.status(404).json({ message: "Trainee not found" });
    }

    const selectedProgram = trainee.selectedPrograms.find(
      p => p.programId && p.programId.toString() === oldProgramId
    );

    if (!selectedProgram) {
      return res.status(400).json({ message: "Trainee is not enrolled in this program" });
    }

    const enrollmentDate = new Date(selectedProgram.enrollmentDate);
    const currentDate = new Date();
    const daysSinceEnrollment = Math.floor(
      (currentDate - enrollmentDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceEnrollment > 7) {
      return res.status(400).json({
        message: "Change period has expired (7 days from enrollment)",
      });
    }

    const newProgram = await Program.findOne({ programName: newProgramName });
    if (!newProgram) {
      return res.status(404).json({ message: "New program not found" });
    }

    trainee.selectedPrograms = trainee.selectedPrograms.filter(
      p => p.programId.toString() !== oldProgramId
    );

    trainee.selectedPrograms.push({
      programId: newProgram._id,
      enrollmentDate: currentDate,
    });
    await trainee.save();

    const oldProgram = await Program.findById(oldProgramId);
    if (oldProgram) {
      oldProgram.registeredTrainees = oldProgram.registeredTrainees.filter(
        id => id.toString() !== traineeId
      );
      await oldProgram.save();
    }

    newProgram.registeredTrainees.push(traineeId);
    await newProgram.save();

    res.status(200).json({ message: "Program changed successfully", trainee });
  } catch (error) {
    res.status(500).json({ message: "Error changing program: " + error.message });
  }
};




exports.getTrainees = async (req, res) => {
  try {
    const searchQuery = search(Trainee, req.query.search);
    const response = await paginatedResults(Trainee, searchQuery, req, {
      populateFields: [
        { path: 'selectedPrograms', select: 'programName' },
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


exports.updateTrainee = async (req, res) => {
    try {
      const userRole = req.user.role;
      if (userRole !== "Admin" && userRole !== "SuperAdmin") {
        return res.status(403).json({ message: "You are not authorized to update trainee data." });
      }
  
      const allowedFields = ["paymentVerification", "name", "contact", "subscriptionType"];
  
      const updates = {};
      Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
          updates[key] = req.body[key];
        }
      });
  
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update or no updates provided." });
      }
  
      const trainee = await Trainee.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!trainee) {
        return res.status(404).json({ message: "Trainee not found" });
      }
  
      res.status(200).json({ message: "Trainee updated successfully", trainee });
    } catch (error) {
      res.status(500).json({ message: "Error updating trainee: " + error.message });
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
