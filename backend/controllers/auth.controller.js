const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")

const prisma = new PrismaClient()

// REGISTER
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body

    const existingUser = await prisma.customer.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.customer.create({
      data: {
        first_name,
        last_name,
        email,
        password_hash: hashedPassword
      }
    })

    res.json({
      message: "Register success",
      user
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.customer.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" })
    }

    res.json({
      message: "Login success",
      user
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}