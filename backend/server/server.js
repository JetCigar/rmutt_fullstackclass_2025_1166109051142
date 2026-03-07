const express = require("express")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")

<<<<<<< HEAD
const authRoutes = require("../routes/auth.routes")

const app = express()
const prisma = new PrismaClient()
=======
const app = express();
const prisma = new PrismaClient();
const cors = require('cors');
app.use(cors()); // เปิด CORS ให้ทุกที่มาเข้าถึงได้
let test = "test-server "

console.log(test);
>>>>>>> 140fe010314751975635b9e84e0e3e29c7bae605

app.use(cors())
app.use(express.json())

<<<<<<< HEAD
// routes
app.use("/api/auth", authRoutes)

// test route
app.get("/", (req, res) => {
  res.json({ message: "API is running" })
})

const PORT = 3000
=======
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
>>>>>>> 140fe010314751975635b9e84e0e3e29c7bae605

app.listen(PORT, async () => {
  try {
    await prisma.$connect()
    console.log(" Database connected")
    console.log(` Server running on http://localhost:${PORT}`)
  } catch (error) {
    console.error("Database connection failed:", error)
  }
<<<<<<< HEAD
})
=======
});



>>>>>>> 140fe010314751975635b9e84e0e3e29c7bae605
