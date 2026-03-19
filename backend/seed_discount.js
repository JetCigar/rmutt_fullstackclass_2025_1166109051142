const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.discount.findUnique({ where: { code: 'SUMMER24' } });
  if (existing) {
    console.log('Discount SUMMER24 already exists.');
    return;
  }
  await prisma.discount.create({
    data: {
      code: 'SUMMER24',
      discount_amount: 100.00,
      is_active: true
    }
  });
  console.log('Created discount SUMMER24 with 100 THB discount.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
