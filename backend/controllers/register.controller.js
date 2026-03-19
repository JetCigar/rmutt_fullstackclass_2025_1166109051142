const register = async (req, res) => {

  try {

    const { first_name, last_name, email, phone, password } = req.body

    const existingUser = await prisma.customer.findUnique({ //Prisma ORM สำหรับค้นหาข้อมูลใน Database
      where: { email }
    })

    if (existingUser) { //ใช้ป้องกันการสมัครสมาชิกซ้ำ
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

    delete user.password_hash //ไม่ให้ password ถูกส่งกลับไป frontend

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