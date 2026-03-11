const register = async (req, res) => {

  try {

    const { first_name, last_name, email, phone, password } = req.body

    const existingUser = await prisma.customer.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.customer.create({
      data: {
        first_name,
        last_name,
        email,
        phone,
        password_hash: hashedPassword
      }
    })

    delete user.password_hash

    res.json({
      message: "Register success",
      user
    })

  } catch (error) {

    res.status(500).json({
      message: "Register failed",
      details: error.message
    })

  }

}