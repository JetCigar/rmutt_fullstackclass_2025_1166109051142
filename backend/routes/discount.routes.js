const express = require('express');
const router = express.Router();

const discountController = require('../controllers/discount.controller');

router.post('/validate', discountController.validateDiscount);

module.exports = router;
