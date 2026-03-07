const express = require("express")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")

const authRoutes = require("../routes/auth.routes")

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// routes
app.use("/api/auth", authRoutes)

// test route
app.get("/", (req, res) => {
  res.json({ message: "API is running" })
})

const PORT = 3000

app.listen(PORT, async () => {
  try {
    await prisma.$connect()
    console.log(" Database connected")
    console.log(` Server running on http://localhost:${PORT}`)
  } catch (error) {
    console.error("Database connection failed:", error)
  }
})