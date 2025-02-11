const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller.js');
const authorizeRole = require('../middlewares/authorize.middleware.js');
const validation = require('../middlewares/validate.middleware.js');
const { getEquipmentByIdValidation, createEquipmentValidation, updateEquipmentValidation, deleteEquipmentValidation } = require('../utils/validators/equipment.validator.js');

router.get('/' , equipmentController.getAllEquipments);

router.get('/:id',
    validation(getEquipmentByIdValidation), 
    equipmentController.getEquipmentById);

router.post('/',
     authorizeRole(["SuperAdmin", "Admin", "EquipmentManager", "Coach"]), 
     validation(createEquipmentValidation),
     equipmentController.createEquipment);

router.put('/:id', 
    authorizeRole(["SuperAdmin", "Admin", "EquipmentManager", "Coach" ]),
    validation(updateEquipmentValidation),
    equipmentController.updateEquipment);

router.delete('/:id', 
    authorizeRole(["SuperAdmin", "Admin", "EquipmentManager", "Coach"]),
    validation(deleteEquipmentValidation),
    equipmentController.deleteEquipment);

module.exports = router;