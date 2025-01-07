const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');

router.get('/', storeController.getProducts);
router.get('/:id', storeController.getProduct);
router.post('/', storeController.addProduct);
router.put('/:id', storeController.updateProduct);
router.delete('/:id', storeController.deleteProduct);

module.exports = router;