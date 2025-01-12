const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller.js');
const authorizeRole = require('../middlewares/authorize.middleware.js');
const validate = require('../middlewares/validate.middleware.js');
const { getEquipmentByIdValidation } = require('../utils/validators/equipment.validator.js');
const { createAdminValidation, updateAdminValidation, deleteAdminValidation } = require('../utils/validators/admin.validator.js');

router.get('/' , equipmentController.getAllEquipments);

router.get('/:id',
    validate(getEquipmentByIdValidation), 
    equipmentController.getEquipmentById);

router.post('/',
     authorizeRole(["SuperAdmin", "Admin", "EquipmentManager", "Coach"]), 
     validate(createAdminValidation),
     equipmentController.createEquipment);

router.put('/:id', 
    authorizeRole(["SuperAdmin", "Admin", "EquipmentManager", "Coach" ]),
    validate(updateAdminValidation),
    equipmentController.updateEquipment);

router.delete('/:id', 
    authorizeRole(["SuperAdmin", "Admin", "EquipmentManager", "Coach"]),
    validate(deleteAdminValidation),
    equipmentController.deleteEquipment);

module.exports = router;