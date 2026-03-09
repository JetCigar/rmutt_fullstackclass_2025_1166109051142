const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// กำหนด URL และเรียกใช้ Controller
router.get('/test-product', productController.getProducts);

module.exports = router;