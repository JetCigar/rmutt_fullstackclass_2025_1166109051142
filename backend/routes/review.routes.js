const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// ดึงรีวิวของผู้ใช้ตาม customer_id
router.get('/:customerId', reviewController.getReviewsByCustomer);

module.exports = router;
