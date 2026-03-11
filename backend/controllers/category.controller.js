// นำเข้า Prisma Client มาใช้งาน
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// สร้างฟังก์ชันสำหรับจัดการ logic นี้
const getTestCategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    const result = categories.map(cat => ({
      ...cat,
      product_count: cat._count.products
    }));

    res.json({ 
      categories: result
    });
  } catch (error) {
    res.status(500).json({ 
      details: error.message
    });
  }
};

// ส่งออกไปให้ Routes เรียกใช้
module.exports = {
  getTestCategory
};