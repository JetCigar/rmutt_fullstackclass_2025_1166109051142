// ไฟล์: server/routes/index.js
const express = require('express');
const router = express.Router();

// Import routes ย่อยๆ มาที่นี่
const categoryRoutes = require('./category.routes');
const authRoutes = require('./auth.routes');

// จับคู่ URL Prefix กับ Routes ย่อย
router.use('/api/categories', categoryRoutes);
router.use('/auth', authRoutes);

// แยกการตั้งค่าบัญชี (profile/settings)
const settingRoutes = require('./setting.routes');
router.use('/auth/settings', settingRoutes);

// แยกการจัดการคำสั่งซื้อ
const orderRoutes = require('./order.routes');
router.use('/auth/orders', orderRoutes);

// แยกการจัดการรีวิว
const reviewRoutes = require('./review.routes');
router.use('/auth/reviews', reviewRoutes);

// แยกการจัดการการจัดส่ง
const shippingRoutes = require('./shipping.routes');
router.use('/auth/shippings', shippingRoutes);

// แยกการจัดการที่อยู่
const addressRoutes = require('./address.routes');
router.use('/auth/addresses', addressRoutes);

module.exports = router;