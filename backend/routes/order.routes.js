const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');

// สร้างคำสั่งซื้อใหม่ (Checkout)
router.post('/create', orderController.createOrder);

// ดึงคำสั่งซื้อของลูกค้าตาม customer_id
router.get('/:customerId', orderController.getOrdersByCustomer);

module.exports = router;
