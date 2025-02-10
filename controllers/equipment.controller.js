const Equipment = require('../models/equipment.model.js');
const mongoose = require('mongoose');
const {search} = require('../utils/search.js');
const {paginatedResults} = require('../utils/pagination.js');
const { responseHandler } = require('../utils/responseHandler.js');



exports.getAllEquipments = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const searchQuery = search(Equipment, searchTerm);
    const paginatedResponse = await paginatedResults(Equipment, searchQuery, req);

    responseHandler(res, 200, true, "Retrieve all Equipments successfully", paginatedResponse);
  } catch (error) {
    responseHandler(res, 500, false, "Something Wrong happend", null, error.message);
  }
};

exports.getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.trim() === "") {
      return responseHandler(res, 400, false, "ID parameter is required");
    }


    if (!mongoose.isValidObjectId(id)) {
      return responseHandler(res, 400, false, "Invalid ID format");
    }

    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return responseHandler(res, 404, false, "Equipment not found");
    }
    responseHandler(res, 200, true, "Equipment retrieved successfully", equipment);
  } catch (error) {
    responseHandler(res, 500, false, "Error fetching equipment", null, error.message);
  }
};


exports.createEquipment = async (req, res) => {
  const { name, image, type, quantity, status } = req.body;
  const newEquipment = new Equipment({ name, image, type, quantity, status });

  try {
    const savedEquipment = await newEquipment.save();
    responseHandler(res, 201, true, "Equipment added successfully", savedEquipment);
  } catch (error) {
    responseHandler(res, 400, false, "Failed to create equipment", null, error.message);
  }
};


exports.updateEquipment = async (req, res) => {
  try {
    const updatedEquipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedEquipment) return responseHandler(res, 404, false, "Equipment not found");

    responseHandler(res, 200, true, "Equipment updated successfully", updatedEquipment);
  } catch (error) {
    responseHandler(res, 400, false, "Failed to update equipment", null, error.message);
  }
};


exports.deleteEquipment = async (req, res) => {
  try {
    const deletedEquipment = await Equipment.findByIdAndDelete(req.params.id);
    const { name } = deletedEquipment;
    if (!deletedEquipment) return responseHandler(res, 404, false, "Equipment not found");
    responseHandler(res, 200, true, `${name} deleted successfully`);
  } catch (error) {
    responseHandler(res, 500, false, "Failed to delete equipment", null, error.message);
  }
};
