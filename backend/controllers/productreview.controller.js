const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getReviewsByProduct(req, res) {
  try {
    // 1. ดึง id จาก URL (ที่มาจาก /ReviewsByProduct/:id)
    // หมายเหตุ: ถ้า product_id ใน Database เป็น Int อย่าลืมแปลงเป็นตัวเลขด้วย Number() หรือ parseInt()
    const productId = Number(req.params.id); 

    // 2. ค้นหาข้อมูลด้วย Prisma
    const reviews = await prisma.review.findMany({
      where: {
        product_id: productId,
      },
      include: {
        customer: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // 3. ส่งข้อมูลกลับไปเป็น JSON
    res.status(200).json(reviews);

  } catch (error) {
    // จัดการกรณีเกิด Error
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}


async function getProductReviewSummary(productId) {
  const summary = await prisma.review.aggregate({
    where: {
      product_id: productId,
    },
    _avg: {
      rating: true, // คำนวณค่าเฉลี่ยของคอลัมน์ rating
    },
    _count: {
      review_id: true, // นับจำนวนรีวิวทั้งหมด
    },
  });

  return {
    averageRating: summary._avg.rating || 0, // ถ้าไม่มีคนรีวิวเลยจะได้ 0
    totalReviews: summary._count.review_id,
  };
}


async function getReviewsByCustomer(customerId) {
  const myReviews = await prisma.review.findMany({
    where: {
      customer_id: customerId, // ค้นหาตาม ID ลูกค้า
    },
    include: {
      // Join ตาราง Product เพื่อเอาชื่อสินค้าและรูปภาพมาแสดง
      product: {
        select: {
          name: true,
          images: {
            where: { is_primary: true }, // ดึงมาแค่รูปหลักรูปเดียว
            select: { image_url: true }
          }
        }
      }
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return myReviews;
}

// ฟังก์ชันสำหรับสร้างรีวิวใหม่ (POST)
async function createReview(req, res) {
  try {
    // 1. รับข้อมูลจาก Request Body (ไม่ต้องรับ customer_id จากหน้าบ้านแล้ว!)
    const { product_id, rating, comment } = req.body;

    // 🌟 ดึง customer_id จาก Token ที่ถูกถอดรหัสแล้วโดย verifyToken
    // ปลอดภัย 100% เพราะ Token นี้ถูกเข้ารหัสจากฝั่งเซิร์ฟเวอร์ของเราเอง
    const customer_id = req.user.customer_id; 

    // 2. ตรวจสอบข้อมูลเบื้องต้น
    if (!product_id || !rating) {
      return res.status(400).json({ 
        message: "กรุณาส่งข้อมูล product_id และ rating ให้ครบถ้วน" 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: "คะแนนรีวิว (rating) ต้องอยู่ระหว่าง 1 ถึง 5" 
      });
    }

    // 3. บันทึกข้อมูลลง Database
    const newReview = await prisma.review.create({
      data: {
        product_id: Number(product_id),
        customer_id: Number(customer_id),
        rating: Number(rating),
        comment: comment || null,
      },
    });

    // 4. ส่งผลลัพธ์
    res.status(201).json({
      message: "บันทึกรีวิวสำเร็จ",
      data: newReview,
    });

  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ 
      message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์", 
      error: error.message 
    });
  }
}

module.exports = {
  getReviewsByProduct,getProductReviewSummary,getReviewsByCustomer,createReview
};