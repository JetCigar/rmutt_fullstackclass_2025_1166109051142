const express = require("express")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")
 
const app = express();
const prisma = new PrismaClient();
app.use(cors()); // เปิด CORS ให้ทุกที่มาเข้าถึงได้
let test = "test-server "
 
console.log(test);
 

app.use(express.json())
 
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
    await prisma.$connect()
    console.log("Database connected")
    console.log(`Server running on http://localhost:${PORT}`)
  } catch (error) {
    console.error("Database connection failed:", error)
  }
});
