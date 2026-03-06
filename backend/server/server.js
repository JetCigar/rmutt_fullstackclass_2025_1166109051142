const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const cors = require('cors');
app.use(cors()); // เปิด CORS ให้ทุกที่มาเข้าถึงได้
let test = "test-server "

console.log(test);

app.use(express.json()); // ให้ Express อ่าน JSON จาก Body ได้

const allRoutes = require('../routes/index');
app.use(allRoutes);

app.get('/test-db', async (req, res) => {
  try {
    // ลอง query แบบง่ายที่สุด (เช่น นับจำนวน Customer)
    const customerCount = await prisma.customer.count();
    res.json({ 
      status: "connected",
      message: "Database connection is healthy!",
      totalCustomers: customerCount 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Cannot connect to database", 
      details: error.message 
    });
  }
});

const PORT = 9999;

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



