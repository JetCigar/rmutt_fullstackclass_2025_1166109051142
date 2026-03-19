const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-info.controller.js');
router.get('/:id', productController.getProductById);

module.exports = router;