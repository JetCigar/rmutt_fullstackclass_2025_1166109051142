const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// GET /auth/settings/:id
// ส่งข้อมูลผู้ใช้งาน (ไม่ส่ง password_hash กลับไปยังคลายเอนต์)
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = Number(id);

    if (!customerId) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }

    const user = await prisma.customer.findUnique({
      where: { customer_id: customerId },
      select: {
        customer_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /auth/settings/:id
// อัปเดตข้อมูลพื้นฐาน และเปลี่ยนรหัสผ่าน (ถ้ามี)
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = Number(id);

    if (!customerId) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }

    const { first_name, last_name, email, phone, password } = req.body;

    const existingUser = await prisma.customer.findUnique({
      where: { customer_id: customerId }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ถ้าอัพเดตอีเมล ให้ตรวจสอบว่าไม่ซ้ำกับคนอื่น
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.customer.findUnique({
        where: { email }
      });
      if (emailTaken) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const dataToUpdate = {
      first_name: first_name ?? existingUser.first_name,
      last_name: last_name ?? existingUser.last_name,
      email: email ?? existingUser.email,
      // ถ้ามีค่า (แม้เป็นสตริงว่าง) จะรับค่านั้น หากไม่มีค่าให้ใช้ค่าเดิม
      phone: phone !== undefined && phone !== null ? String(phone).trim() : existingUser.phone
    };

    if (password) {
      dataToUpdate.password_hash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.customer.update({
      where: { customer_id: customerId },
      data: dataToUpdate,
      select: {
        customer_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true
      }
    });

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
