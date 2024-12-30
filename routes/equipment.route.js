const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller.js');

router.get('/', equipmentController.getAllEquipments);
router.get('/:id', equipmentController.getEquipmentById);
router.post('/', equipmentController.createEquipment);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;