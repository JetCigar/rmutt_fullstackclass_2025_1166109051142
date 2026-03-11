// server/routes/index.js
const express = require('express');
const router = express.Router();

// import routes
const categoryRoutes = require('./category.routes');
const authRoutes = require('./auth.routes');
const cartRoutes = require('./cart.routes');
const addressRoutes = require('./address.routes');
const productRoutes = require('./product.routes');

// use routes
router.use('/api/categories', categoryRoutes);
router.use('/auth', authRoutes);
router.use('/api/products', productRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/addresses', addressRoutes);

module.exports = router;