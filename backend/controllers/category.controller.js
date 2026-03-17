// นำเข้า Prisma Client มาใช้งาน
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// สร้างฟังก์ชันสำหรับจัดการ logic นี้
const getTestCategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            images: {
              select: { 
                image_url: true // <--- สั่งให้เลือกมาแค่คอลัมน์นี้
              },
              where: {
                is_primary: true // ดึงเฉพาะรูปหลัก (ถ้าต้องการ)
              }
            }
          }
        },
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