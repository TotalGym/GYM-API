const {paginatedResults} = require("../utils/pagination.js");
const bcrypt = require("bcrypt");
const Trainee = require("../models/trainee.model.js");
const Program = require("../models/programs.model.js");

const {search} = require("../utils/search.js");
const { default: mongoose } = require("mongoose");
const { responseHandler } = require("../utils/responseHandler.js");

// Refactor create trainee to add program while creating using program name
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

    if (!name || !contact || !gender || !startDate || !subscriptionType || !contact.email || !contact.phoneNumber) {
      return responseHandler(res, 400, false, "Missing required fields");
    }

    const existingTrainee = await Trainee.findOne({ "contact.email": contact.email });
    if (existingTrainee) {
      return responseHandler(res, 400, false, "Email is already in use by another trainee.");
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
      return responseHandler(res, 400, false, "Invalid subscriptionType. Must be 'monthly' or 'annually'.");
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
    responseHandler(res, 201, true, "Trainee created successfully", trainee);  
  } catch (error) {
    responseHandler(res, 400, false,  `Error creating trainee: ${error.message}`, null ,error.message);
  }
};


// refactor selecting program, to set an enrollment date for the trainee & update his startDate
exports.selectProgram = async (req, res) => {
  const { traineeId, programId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return responseHandler(res, 400, false, "Invalid program ID format");
    }

    const program = await Program.findById(programId);
    if (!program) {
      return responseHandler(res, 404, false, "Program not found");
    }

    const trainee = await Trainee.findById(traineeId);
    if (!trainee) {
      return responseHandler(res, 404, false, "Trainee not found");
    }

    trainee.selectedPrograms.push(programId);

    await trainee.save();

    if (trainee.selectedPrograms.includes(programId)) {
      return responseHandler(res, 400, false, "Program already selected by this trainee");
    }

    program.registeredTrainees.push(traineeId);
    await program.save();

    responseHandler(res, 200, "Program selected successfully");
  } catch (error) {
    responseHandler(res, 500, "Error selecting program: ", null, error.message);
  }
};

exports.changeProgram = async (req, res) => {
  const { traineeId, oldProgramId } = req.params;
  const { newProgramName } = req.body;

  try {
    const trainee = await Trainee.findById(traineeId);
    if (!trainee) {
      return responseHandler(res, 404, false, "Trainee not found");
    }

    const selectedProgram = trainee.selectedPrograms.find(
      p => p.programId && p.programId.toString() === oldProgramId
    );

    if (!selectedProgram) {
      return responseHandler(res, 400, false, "Trainee is not enrolled in this program");
    }

    const enrollmentDate = new Date(selectedProgram.enrollmentDate);
    const currentDate = new Date();
    const daysSinceEnrollment = Math.floor(
      (currentDate - enrollmentDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceEnrollment > 7) {
      return responseHandler(res, 400, false, "Change period has expired (7 days from enrollment)");
    }

    const newProgram = await Program.findOne({ programName: newProgramName });
    if (!newProgram) {
      return responseHandler(res, 404, false, "New program not found");
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

    responseHandler(res, 200, true, "Program changed successfully");
  } catch (error) {
    responseHandler(res, 500, false, "Error changing program...", null,  error.message);
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

    responseHandler(res, 200, true, "Fetched Trainees Successfully", response);
  } catch (error) {
    responseHandler(res, 500, false, "Error fetching trainees" , null, error.message);
  }
};

exports.getTraineeById = async (req, res) => {
    const {id} = req.params;
    try {
      const trainee = await Trainee.findById(id).populate({ path: "selectedPrograms", select: "programName" });
      if(!trainee) return responseHandler(res, 404, "Trainee Not found");

      responseHandler(res, 200, true, "Trainee Fetched success", trainee);
    } catch (error) {
      responseHandler(res, 500, false, "Error fetching trainees", null, error.message);
    }
  };


exports.updateTrainee = async (req, res) => {
  console.log("WTF is going on!!!")
    try {
      const userRole = req.user.role;
      if (userRole !== "Admin" && userRole !== "SuperAdmin") {
        return responseHandler(res, 403, false, "You are not authorized to update trainee data.");
      }

      console.log(userRole);
  
      const allowedFields = 
      ["paymentVerification", "name", 
        "contact", "subscriptionType", 
        "selectedPrograms", "assignedCoach", "membership"];
  
      const updates = {};
      Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
          updates[key] = req.body[key];
        }
      });
  
      if (Object.keys(updates).length === 0) {
        return responseHandler(res, 400, false, "No valid fields to update or no updates provided.");
      }
  
      const trainee = await Trainee.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
      if (!trainee) {
        return responseHandler(res, 404, false, "Trainee not found");
      }
  
      responseHandler(res, 200, true, "Trainee updated successfully", trainee);
    } catch (error) {
      responseHandler(res, 500, false, "Error updating trainee: ", null, error.message);
    }
};
  
exports.deleteTrainee = async (req, res) => {
  try {
    const trainee = await Trainee.findByIdAndDelete(req.params.id);
    if (!trainee) return responseHandler(res, 404, false, "Trainee not found");

   responseHandler(res, 200, true, "Trainee deleted successfully");
  } catch (error) {
    responseHandler(res, 500, false, "Error deleting trainee", null, error.message);
  }
};
