const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');

// เพิ่มที่อยู่ใหม่ (POST /auth/addresses)
router.post('/', addressController.createAddress);

// ดึงที่อยู่ลูกค้าตาม customer_id (GET /auth/addresses/:customerId)
// ย้ายมาไว้หลัง POST และก่อน DELETE เพื่อป้องกันการทับซ้อน (แม้ว่าคนละ Method ก็ตาม)
router.get('/:customerId', addressController.getAddressesByCustomer);

// ลบที่อยู่ (DELETE /auth/addresses/:addressId)
router.delete('/:addressId', addressController.deleteAddress);

module.exports = router;
