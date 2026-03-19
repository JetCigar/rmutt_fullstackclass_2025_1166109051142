// server/routes/index.js
const express = require('express');
const router = express.Router();

console.log('Loading routes from backend/routes/index.js');

// import routes
const categoryRoutes = require('./category.routes');
const authRoutes = require('./auth.routes');
const cartRoutes = require('./cart.routes');
const productRoutes = require('./product.routes');
const productinfoRoutes = require('./productinfo.routes');
const productreview = require ('./productreview.routes')


// use routes
router.use('/api/productInfo',productinfoRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/auth', authRoutes);
router.use('/api/products', productRoutes);
router.use('/api/cart', cartRoutes);

//product reveiw
router.use('/api/review', productreview);

// แยกการตั้งค่าบัญชี (profile/settings)
const settingRoutes = require('./setting.routes');
router.use('/auth/settings', settingRoutes);

// แยกการจัดการคำสั่งซื้อ
// 1. Specific routes first (more specific prefixes)
const orderRoutes = require('./order.routes');
router.use('/auth/orders', orderRoutes);

const addressRoutes = require('./address.routes');
router.use('/auth/addresses', addressRoutes);

router.use('/auth/settings', settingRoutes);

const reviewRoutes = require('./review.routes');
router.use('/auth/reviews', reviewRoutes);

const shippingRoutes = require('./shipping.routes');
router.use('/auth/shippings', shippingRoutes);

// 2. Base routes / API routes
router.use('/api/categories', categoryRoutes);
router.use('/api/products', productRoutes);
router.use('/api/cart', cartRoutes);
router.use('/auth', authRoutes);

module.exports = router;