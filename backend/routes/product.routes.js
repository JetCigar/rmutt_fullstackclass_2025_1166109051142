const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// กำหนด URL และเรียกใช้ Controller
router.get('/test-product', productController.getProducts);
/* ================= SEARCH PRODUCT ================= */
router.get('/search', async (req, res) => {

  const q = (req.query.q || '').trim();

  if (!q) {
    return res.json([]);
  }

  try {

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: q,
              mode: 'insensitive'
            }
          }
        ]
      }
    });

    res.json(products);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }

});
module.exports = router;