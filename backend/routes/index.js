// ไฟล์: server/routes/index.js
const express = require('express');
const router = express.Router();

// Import routes ย่อยๆ มาที่นี่
const categoryRoutes = require('./category.routes');

// จับคู่ URL Prefix กับ Routes ย่อย
router.use('/api/categories', categoryRoutes);

module.exports = router;