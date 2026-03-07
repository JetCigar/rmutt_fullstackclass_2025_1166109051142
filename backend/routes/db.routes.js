const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// สังเกตว่าเราไม่ต้องเขียน req, res ตรงนี้แล้ว
router.post('/register', userController.registerUser);

module.exports = router;