const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');

// ดึงคำสั่งซื้อของลูกค้าตาม customer_id
router.get('/:customerId', orderController.getOrdersByCustomer);

// สร้างคำสั่งซื้อใหม่ (Checkout)
router.post('/create', orderController.createOrder);

module.exports = router;
