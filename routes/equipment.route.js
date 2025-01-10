const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller.js');
const authorizeRole = require('../middlewares/authorize.middleware.js');

router.get('/' , equipmentController.getAllEquipments);
router.get('/:id', equipmentController.getEquipmentById);
router.post('/', authorizeRole(["SuperAdmin", "Admin", "EquipmentManager"]), equipmentController.createEquipment);
router.put('/:id', authorizeRole(["SuperAdmin", "Admin", "EquipmentManager"]), equipmentController.updateEquipment);
router.delete('/:id', authorizeRole(["SuperAdmin", "Admin", "EquipmentManager"]), equipmentController.deleteEquipment);

module.exports = router;