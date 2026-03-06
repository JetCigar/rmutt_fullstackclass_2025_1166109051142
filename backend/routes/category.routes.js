const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// กำหนด URL และเรียกใช้ Controller
router.get('/test-category', categoryController.getTestCategory);

module.exports = router;