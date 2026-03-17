const express = require('express');
const router = express.Router();

const settingController = require('../controllers/setting.controller');

// อ่านข้อมูลบัญชี (โดยใช้ customer_id)
router.get('/:id', settingController.getProfile);

// อัปเดตข้อมูลบัญชี (โดยใช้ customer_id)
router.put('/:id', settingController.updateProfile);

module.exports = router;
