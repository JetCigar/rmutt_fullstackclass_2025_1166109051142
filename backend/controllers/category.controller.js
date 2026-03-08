// นำเข้า Prisma Client มาใช้งาน
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// สร้างฟังก์ชันสำหรับจัดการ logic นี้
const getTestCategory = async (req, res) => {
  try {
    const category = await prisma.category.findMany(
      {
        include: {
          products: true, // รวมข้อมูลสินค้าที่อยู่ในหมวดหมู่นี้ด้วย
        }
      }
    );

    res.json({ 
      categories: category
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