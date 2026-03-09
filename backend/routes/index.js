// server/routes/index.js
const express = require('express');
const router = express.Router();

// import routes
const categoryRoutes = require('./category.routes');
const cartRoutes = require('./cart.routes');
const addressRoutes = require('./address.routes');

// use routes
router.use('/api/categories', categoryRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/addresses', addressRoutes);

module.exports = router;