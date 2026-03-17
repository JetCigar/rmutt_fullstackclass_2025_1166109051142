const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shipping.controller');

// ดึงสถานะการจัดส่งตาม customer_id
router.get('/:customerId', shippingController.getShippingsByCustomer);

module.exports = router;
