const { paginatedResults } = require("../utils/pagination.js");
const bcrypt = require("bcrypt");
const Trainee = require("../models/trainee.model.js");
const Program = require("../models/programs.model.js");
const Staff = require("../models/staff.model.js");

const { search } = require("../utils/search.js");
const { default: mongoose } = require("mongoose");
const { responseHandler } = require("../utils/responseHandler.js");

exports.createTrainee = async (req, res) => {
  try {
    const {
      name,
      contact,
      gender,
      subscriptionType,
      password,
      assignedCoach,
      selectedPrograms = [],
    } = req.body;

    const validationError = validateInput({
      name,
      contact,
      gender,
      subscriptionType,
    });
    if (validationError) {
      return responseHandler(res, 400, false, validationError);
    }

    const existingTrainee = await Trainee.findOne({
      "contact.email": contact.email,
    });
    if (existingTrainee) {
      return responseHandler(
        res,
        400,
        false,
        "Email is already in use by another trainee."
      );
    }

    const programsError = await validateSelectedPrograms(selectedPrograms);
    if (programsError) {
      return responseHandler(res, 400, false, programsError);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const startDate = new Date();
    const endDate = calculateEndDate(startDate, subscriptionType);

    const coach = await Staff.findById(assignedCoach);
    if (!coach) {
      return responseHandler(res, 404, false, null, "Coach not found");
    }

    const trainee = new Trainee({
      name,
      contact,
      gender,
      membership: { startDate, endDate },
      selectedPrograms,
      subscriptionType,
      password: hashedPassword,
      assignedCoach: coach._id,
    });

    if (selectedPrograms.length > 0) {
      await Program.updateMany(
        { _id: { $in: selectedPrograms } },
        { $addToSet: { registeredTrainees: trainee._id } }
      );
    }

    await trainee.save();

    responseHandler(res, 201, true, "Trainee created successfully", trainee);
  } catch (error) {
    responseHandler(
      res,
      400,
      false,
      `Error creating trainee: ${error.message}`,
      null,
      error.message
    );
  }
};

//todo: Add an enrollment date when changing for both add and change + make it one program!
exports.changeProgram = async (req, res) => {
  const { traineeId, oldProgramId } = req.params;
  const { newProgramName } = req.body;

  try {
    const trainee = await Trainee.findById(traineeId);
    if (!trainee) {
      return responseHandler(res, 404, false, "Trainee not found");
    }

    if (!mongoose.Types.ObjectId.isValid(oldProgramId)) {
      return responseHandler(res, 400, false, "Invalid program ID");
    }

    const program = await Program.findById(oldProgramId);
    if (!program) return responseHandler(res, 404, false, "Program not found");

    console.log(trainee.selectedPrograms);

    const selectedProgram = trainee.selectedPrograms.find(
      (p) => p.toString() === oldProgramId
    );

    if (!selectedProgram) {
      return responseHandler(
        res,
        400,
        false,
        "Trainee is not enrolled in this program"
      );
    }

    const enrollmentDate = new Date(selectedProgram.enrollmentDate);
    const currentDate = new Date();
    const daysSinceEnrollment = Math.floor(
      (currentDate - enrollmentDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceEnrollment > 7) {
      return responseHandler(
        res,
        400,
        false,
        "Change period has expired (7 days from enrollment)"
      );
    }

    const newProgram = await Program.findOne({
      programName: { $regex: newProgramName, $options: "i" },
    });

    if (!newProgram) {
      return responseHandler(res, 404, false, "New program not found");
    }

    trainee.selectedPrograms.push(newProgram._id);

    await trainee.save();

    const oldProgram = await Program.findById(oldProgramId);
    if (oldProgram) {
      oldProgram.registeredTrainees = oldProgram.registeredTrainees.filter(
        (id) => id.toString() !== traineeId
      );
      await oldProgram.save();
    }

    newProgram.registeredTrainees.push(traineeId);
    await newProgram.save();

    responseHandler(res, 200, true, "Program changed successfully");
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      "Error changing program...",
      null,
      error.message
    );
  }
};

exports.getTrainees = async (req, res) => {
  try {
    const searchQuery = search(Trainee, req.query.search);
    const response = await paginatedResults(Trainee, searchQuery, req, {
      populateFields: [
        { path: "selectedPrograms", select: "programName" },
        { path: "assignedCoach", select: "name" },
      ],
    });

    responseHandler(res, 200, true, "Fetched Trainees Successfully", response);
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      "Error fetching trainees",
      null,
      error.message
    );
  }
};

exports.getTraineeById = async (req, res) => {
  const { id } = req.params;
  try {
    const trainee = await Trainee.findById(id).populate({
      path: "selectedPrograms",
      select: "programName",
    });
    if (!trainee) return responseHandler(res, 404, "Trainee Not found");

    responseHandler(res, 200, true, "Trainee Fetched success", trainee);
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      "Error fetching trainees",
      null,
      error.message
    );
  }
};

exports.updateTrainee = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "Admin" && userRole !== "SuperAdmin") {
      return responseHandler(
        res,
        403,
        false,
        "You are not authorized to update trainee data."
      );
    }

    const allowedFields = [
      "paymentVerification",
      "name",
      "contact",
      "subscriptionType",
      "selectedPrograms",
      "assignedCoach",
      "membership",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return responseHandler(
        res,
        400,
        false,
        "No valid fields to update or no updates provided."
      );
    }

    const trainee = await Trainee.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!trainee) {
      return responseHandler(res, 404, false, "Trainee not found");
    }

    responseHandler(res, 200, true, "Trainee updated successfully", trainee);
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      "Error updating trainee: ",
      null,
      error.message
    );
  }
};

exports.deleteTrainee = async (req, res) => {
  try {
    const trainee = await Trainee.findByIdAndDelete(req.params.id);
    if (!trainee) return responseHandler(res, 404, false, "Trainee not found");

    responseHandler(res, 200, true, "Trainee deleted successfully");
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      "Error deleting trainee",
      null,
      error.message
    );
  }
};

exports.searchTrainees = async (req, res) => {
  try {
    const searchQuery = search(Trainee, req.query.search);
    const trainees = await Trainee.find(searchQuery);

    if (trainees.length === 0) {
      return responseHandler(res, 404, false, "No trainees found", []);
    }

    const Data = trainees.map((trainee) => ({
      id: trainee._id,
      name: trainee.name,
    }));

    responseHandler(res, 200, true, "Trainees found successfully", Data);
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      "Error searching trainees",
      null,
      error.message
    );
  }
};

const calculateEndDate = (startDate, subscriptionType) => {
  const endDate = new Date(startDate);
  if (subscriptionType === "monthly") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (subscriptionType === "annually") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    throw new Error(
      "Invalid subscriptionType. Must be 'monthly' or 'annually'."
    );
  }
  return endDate;
};

const validateInput = ({ name, contact, gender, subscriptionType }) => {
  if (
    !name ||
    !contact ||
    !gender ||
    !subscriptionType ||
    !contact.email ||
    !contact.phoneNumber
  ) {
    return "Missing required fields";
  }
  return null;
};

const validateSelectedPrograms = async (selectedPrograms) => {
  if (!Array.isArray(selectedPrograms) || selectedPrograms.length === 0) {
    return "selectedPrograms must be a non-empty array.";
  }

  const invalidProgramIds = selectedPrograms.filter(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );

  if (invalidProgramIds.length > 0) {
    return "One or more selected programs have invalid IDs.";
  }

  const programs = await Program.find({
    _id: { $in: selectedPrograms },
  }).select("_id");

  const existingProgramIds = programs.map((p) => p._id.toString());

  const nonExistingPrograms = selectedPrograms.filter(
    (id) => !existingProgramIds.includes(id.toString())
  );

  if (nonExistingPrograms.length > 0) {
    return "One or more selected programs do not exist.";
  }

  return null;
};
