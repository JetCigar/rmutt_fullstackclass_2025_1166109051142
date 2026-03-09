const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
/*
เพิ่มสินค้าเข้า cart
POST /cart
*/
exports.addToCart = async (req, res) => {
  try {
    const { customer_id, product_id, quantity } = req.body

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        customer_id,
        product_id
      }
    })

    // ถ้ามีสินค้าอยู่แล้ว → เพิ่มจำนวน
    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: {
          cart_item_id: existingItem.cart_item_id
        },
        data: {
          quantity: existingItem.quantity + quantity
        }
      })

      return res.json(updatedItem)
    }

    // ถ้ายังไม่มี → สร้างใหม่
    const cartItem = await prisma.cartItem.create({
      data: {
        customer_id,
        product_id,
        quantity
      }
    })

    res.json(cartItem)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Add to cart failed" })
  }
}


/*
ดึง cart ของลูกค้า
GET /cart/:customer_id
*/
exports.getCart = async (req, res) => {
  try {

    const { customer_id } = req.params

    const cart = await prisma.cartItem.findMany({
      where: {
        customer_id: parseInt(customer_id)
      },
      include: {
        product: true
      }
    })

    res.json(cart)

  } catch (error) {
    res.status(500).json({ error: "Cannot get cart" })
  }
}


/*
อัปเดตจำนวนสินค้า
PUT /cart/:cart_item_id
*/
exports.updateCartItem = async (req, res) => {

  try {

    const { cart_item_id } = req.params
    const { quantity } = req.body

    const item = await prisma.cartItem.update({
      where: {
        cart_item_id: parseInt(cart_item_id)
      },
      data: {
        quantity
      }
    })

    res.json(item)

  } catch (error) {
    res.status(500).json({ error: "Update cart failed" })
  }
}


/*
ลบสินค้าออกจาก cart
DELETE /cart/:cart_item_id
*/
exports.removeCartItem = async (req, res) => {

  try {

    const { cart_item_id } = req.params

    await prisma.cartItem.delete({
      where: {
        cart_item_id: parseInt(cart_item_id)
      }
    })

    res.json({ message: "Item removed from cart" })

  } catch (error) {
    res.status(500).json({ error: "Delete failed" })
  }
}


/*
ล้าง cart
DELETE /cart/customer/:customer_id
*/
exports.clearCart = async (req, res) => {

  try {

    const { customer_id } = req.params

    await prisma.cartItem.deleteMany({
      where: {
        customer_id: parseInt(customer_id)
      }
    })

    res.json({ message: "Cart cleared" })

  } catch (error) {
    res.status(500).json({ error: "Clear cart failed" })
  }
}