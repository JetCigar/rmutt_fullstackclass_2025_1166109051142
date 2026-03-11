const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart.controller')

router.post('/', cartController.addToCart)
router.get('/:customer_id', cartController.getCart)
router.put('/:cart_item_id', cartController.updateCartItem)
router.delete('/:cart_item_id', cartController.removeCartItem)
router.delete('/customer/:customer_id', cartController.clearCart)

module.exports = router