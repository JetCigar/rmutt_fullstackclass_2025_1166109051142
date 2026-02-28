const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();


app.use(express.json()); // ให้ Express อ่าน JSON จาก Body ได้

// --- นี่คือฟังก์ชันที่คุณเขียน ---
async function createUser(email, password) {
  return await prisma.user.create({
    data: { email, password },
  });
}

// --- นี่คือวิธีนำไปใช้ใน server.js (สร้าง Route) ---
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await createUser(email, password);
    res.status(201).json({ message: "User created!", user });
  } catch (error) {
    res.status(400).json({ error: "Email already exists or something went wrong" });
  }
});

app.get('/test-db', async (req, res) => {
  try {
    // ลอง query แบบง่ายที่สุด (เช่น นับจำนวน Category)
    const categoryCount = await prisma.category.count();
    res.json({ 
      status: "connected",
      message: "Database connection is healthy! 55555",
      totalCategories: categoryCount 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Cannot connect to database", 
      details: error.message 
    });
  }
});
const PORT = 3000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  } catch (e) {
    console.error('❌ Database connection failed:', e.message);
    process.exit(1); // ปิดแอปทันทีถ้าต่อ DB ไม่ได้
  }
});