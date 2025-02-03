const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const validation = require('../middlewares/validate.middleware');
const { createProductValidation, updateProductValidation } = require('../utils/validators/store.validator');

router.get('/', storeController.getProducts);
router.get('/:id', storeController.getProduct);
router.post('/', validation(createProductValidation), storeController.addProduct);
router.put('/:id', validation(updateProductValidation), storeController.updateProduct);
router.delete('/:id', storeController.deleteProduct);

module.exports = router;