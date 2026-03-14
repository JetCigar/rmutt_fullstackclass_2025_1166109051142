const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');

// ดึงที่อยู่ลูกค้าตาม customer_id
router.get('/:customerId', addressController.getAddressesByCustomer);

module.exports = router;
