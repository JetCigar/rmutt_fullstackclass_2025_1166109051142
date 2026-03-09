// นำเข้า Prisma Client มาใช้งาน
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// สร้างฟังก์ชันสำหรับจัดการ logic นี้
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true
      }
    });

    res.json({ 
      products: products
    });
  } catch (error) {
    res.status(500).json({ 
      details: error.message
    });
  }
};

// ส่งออกไปให้ Routes เรียกใช้
module.exports = {
  getProducts
};