const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Start Seeding Data ---');

  // 1. สร้าง Role (SuperAdmin)
  let adminRole = await prisma.role.findFirst({
    where: { role_name: 'SuperAdmin' }
  });


  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: {
        role_name: 'SuperAdmin',
        description: 'Full access to everything',
      },
    });
    console.log('Role "SuperAdmin" created.');
  }

  // 2. สร้าง Admin
  let admin = await prisma.admin.findUnique({
    where: { email: 'admin@test.com' }
  });

  if (!admin) {
    admin = await prisma.admin.create({
      data: {
        username: 'admin01',
        password_hash: 'hashed_password_here',
        email: 'admin@test.com',
        role_id: adminRole.role_id,
      },
    });
    console.log('Admin "admin@test.com" created.');
  }

  // 3. สร้าง Customer
  let customer = await prisma.customer.findUnique({
    where: { email: 'customer@test.com' }
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        first_name: 'Somchai',
        last_name: 'Jaidee',
        email: 'customer@test.com',
        password_hash: 'customer_pass_123',
        phone: '0812345678',
      },
    });
    console.log('Customer "customer@test.com" created.');
  }

  // 4. สร้าง Category
  let category = await prisma.category.findFirst({
    where: { name: 'Gadgets' }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Gadgets',
        description: 'Electronic devices and tools',
      }
    });
    console.log('Category "Gadgets" created.');
  }

  // 5. สร้าง Product
  let product = await prisma.product.findFirst({
    where: { sku: 'KB-001' }
  });
}