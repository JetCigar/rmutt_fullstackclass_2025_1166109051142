const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.validateDiscount = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Discount code is required' });
    }

    const discount = await prisma.discount.findUnique({
      where: { code }
    });

    if (!discount) {
      return res.status(404).json({ message: 'โค้ดส่วนลดไม่ถูกต้อง' });
    }

    if (!discount.is_active) {
      return res.status(400).json({ message: 'โค้ดส่วนลดนี้ไม่สามารถใช้งานได้แล้ว' });
    }

    res.json({
      success: true,
      discount_id: discount.discount_id,
      code: discount.code,
      discount_amount: discount.discount_amount
    });
  } catch (error) {
    console.error('Failed to validate discount', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
