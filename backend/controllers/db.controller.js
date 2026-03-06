const prisma = require('../config/prisma');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // โค้ดจาก createUser ของคุณ ย้ายมาใส่ตรงนี้ได้เลย
    const user = await prisma.user.create({
      data: { email, password },
    });
    res.status(201).json({ message: "User created!", user });
  } catch (error) {
    res.status(400).json({ error: "Email already exists or something went wrong" });
  }
};

module.exports = { registerUser };