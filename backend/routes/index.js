// ไฟล์: server/routes/index.js
const express = require('express');
const router = express.Router();

// Import routes ย่อยๆ มาที่นี่
const categoryRoutes = require('./category.routes');
const authRoutes = require('./auth.routes');

// จับคู่ URL Prefix กับ Routes ย่อย
router.use('/api/categories', categoryRoutes);
router.use('/auth', authRoutes);

const productRoutes = require('./product.routes');
router.use('/api/products', productRoutes);

module.exports = router;