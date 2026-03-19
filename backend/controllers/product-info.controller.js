const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // รับ id จาก URL
    const product = await prisma.product.findUnique({
      where: {
        product_id: parseInt(id) // แปลงเป็น Number ตาม Schema
      },
      include: {
        category: true,      // ดึงข้อมูลหมวดหมู่มาด้วย
        images: true,        // ดึงรูปภาพทั้งหมด (ไม่ใช่แค่รูปหลัก)
        reviews: {           // ดึงรีวิว (ถ้ามี)
          include: { customer: { select: { first_name: true } } }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProductById
};