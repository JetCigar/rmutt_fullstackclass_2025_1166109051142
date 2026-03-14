// server/routes/index.js
const express = require('express');
const router = express.Router();

// import routes
const categoryRoutes = require('./category.routes');
const cartRoutes = require('./cart.routes');
// const addressRoutes = require('./address.routes');  // address routes removed, file missing
const authRoutes = require('./auth.routes');

// use routes
router.use('/api/categories', categoryRoutes);
router.use('/api/cart', cartRoutes);
// router.use('/api/addresses', addressRoutes);  // disabled, no address routes
router.use('/auth', authRoutes);

module.exports = router;