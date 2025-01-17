const express = require('express');
const salesController = require('../controllers/salesHistory.controller.js');
const router = express.Router();

router.post('/', salesController.Sell);
router.get('/', salesController.getAllSales);
router.get('/:productId', salesController.getSalesByProduct);
router.get('/', salesController.getFilteredSales);
router.delete('/:id', salesController.deleteSale);

module.exports = router;