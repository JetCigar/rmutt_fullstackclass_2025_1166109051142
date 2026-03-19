const express = require('express');
const router = express.Router();
const productController = require('../controllers/productreview.controller');


// กำหนด URL และเรียกใช้ Controller
router.get('/ReviewsByProduct/:id', productController.getReviewsByProduct);
router.get('/ProductReviewSummary', productController.getProductReviewSummary);
router.get('/getReviewsByCustomer', productController.getReviewsByCustomer);
router.post('/create', productController.createReview);
module.exports = router;