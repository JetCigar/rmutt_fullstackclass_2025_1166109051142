const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // ลองดึงข้อมูลสินค้ามา 1 ชิ้น
    const product = await prisma.product.findFirst();
    console.log('--- Database Connection Test ---');
    if (product) {
      console.log('Successfully connected! Found product:', product.name);
    } else {
      console.log('Connected, but the table is empty.');
    }
  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();