const express = require('express');
const router = express.Router();
const productController = require('../controllers/productreview.controller');
const verifyToken = require('../middleware/auth.middleware')

// กำหนด URL และเรียกใช้ Controller
router.get('/ReviewsByProduct/:id', productController.getReviewsByProduct);
router.get('/ProductReviewSummary', productController.getProductReviewSummary);
router.get('/getReviewsByCustomer', productController.getReviewsByCustomer);
router.post('/create',verifyToken, productController.createReview);
module.exports = router;