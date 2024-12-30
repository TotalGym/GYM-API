const express = require('express');
const salesController = require('../controllers/salesHistory.controller.js');
const router = express.Router();

router.post('/sales', salesController.addSale);
router.get('/sales', salesController.getAllSales);
router.get('/sales/:productId', salesController.getSalesByProduct);
router.delete('/sales/:id', salesController.deleteSale);

module.exports = router;

// todo fix this route to be useable correctly  