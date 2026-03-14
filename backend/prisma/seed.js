const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- 🌱 Start Seeding Agricultural Equipment Data ---');

  if (process.env.NODE_ENV !== 'production') {
  await prisma.cartItem.deleteMany();
  }

  // 1. สร้าง Role
  const superAdminRole = await prisma.role.upsert({
    where: { role_id: 1 },
    update: {},
    create: {
      role_name: 'SuperAdmin',
      description: 'ผู้ดูแลระบบสูงสุด จัดการได้ทุกอย่าง',
    },
  });

  // 2. สร้าง Admin
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@agrishop.com' },
    update: {},
    create: {
      username: 'agri_admin',
      password_hash: 'hashed_password_1234',
      email: 'admin@agrishop.com',
      role_id: superAdminRole.role_id,
    },
  });

  // 3. สร้าง Customer
  const customer1 = await prisma.customer.upsert({
    where: { email: 'sommai.farmer@example.com' },
    update: {},
    create: {
      first_name: 'สมหมาย',
      last_name: 'รักเกษตร',
      email: 'sommai.farmer@example.com',
      password_hash: 'farmer_pass_888',
      phone: '0891234567',
    },
  });

  // 4. สร้างที่อยู่จัดส่งให้ลูกค้า
  let address = await prisma.address.findFirst({
    where: { customer_id: customer1.customer_id }
  });
  
  if (!address) {
    address = await prisma.address.create({
      data: {
        customer_id: customer1.customer_id,
        address_line: '99/9 หมู่ 1 ตำบลคลองหก ฟาร์มเกษตรพอเพียง',
        province: 'ปทุมธานี',
        zip_code: '12110',
        is_default: true,
      }
    });
  }

  // 5. สร้าง Category (เพิ่มหมวดหมู่ปุ๋ยและวัสดุการเกษตร)
  const categoryMachine = await prisma.category.upsert({
    where: { category_id: 1 }, 
    update: {},
    create: { name: 'เครื่องจักรกลการเกษตร', description: 'เครื่องตัดหญ้า, ปั๊มน้ำ, เครื่องพ่นยา' },
  });

  const categoryTools = await prisma.category.upsert({
    where: { category_id: 2 }, 
    update: {},
    create: { name: 'อุปกรณ์ทำสวนและเครื่องมือช่าง', description: 'กรรไกรตัดกิ่ง, จอบ, เสียม, สายยาง' },
  });

  const categorySupplies = await prisma.category.upsert({
    where: { category_id: 3 }, 
    update: {},
    create: { name: 'วัสดุการเกษตรและปุ๋ย', description: 'ปุ๋ย, ดินปลูก, ถาดเพาะกล้า, เมล็ดพันธุ์' },
  });
  console.log('✅ Categories created');

  // 6. สร้าง Product (สินค้าเดิม 3 รายการ + สินค้าใหม่ 5 รายการ)
  // --- สินค้าเดิม ---
  const product1 = await prisma.product.upsert({
    where: { sku: 'AG-BC-004' }, update: {},
    create: { category_id: categoryMachine.category_id, sku: 'AG-BC-004', name: 'เครื่องตัดหญ้าสะพายบ่า 4 จังหวะ', price: 2590.00, stock_quantity: 20 },
  });

  const product2 = await prisma.product.upsert({
    where: { sku: 'AG-WP-002' }, update: {},
    create: { category_id: categoryMachine.category_id, sku: 'AG-WP-002', name: 'ปั๊มน้ำหอยโข่ง 2 นิ้ว 1.5 HP', price: 3200.00, stock_quantity: 15 },
  });

  const product3 = await prisma.product.upsert({
    where: { sku: 'HT-PS-001' }, update: {},
    create: { category_id: categoryTools.category_id, sku: 'HT-PS-001', name: 'กรรไกรตัดกิ่งไม้ด้ามอลูมิเนียม', price: 350.00, stock_quantity: 100 },
  });

  // --- สินค้าใหม่ 5 รายการ ---
  const product4 = await prisma.product.upsert({
    where: { sku: 'AG-SP-016' }, update: {},
    create: {
      category_id: categoryMachine.category_id,
      sku: 'AG-SP-016',
      name: 'เครื่องพ่นยาแบตเตอรี่ 16 ลิตร',
      description: 'ฉีดพ่นละอองฝอยละเอียด แบตเตอรี่อึดใช้งานได้ทั้งวัน',
      price: 990.00,
      weight: 3.5,
      stock_quantity: 30,
      is_active: true,
    },
  });

  const product5 = await prisma.product.upsert({
    where: { sku: 'HT-HO-002' }, update: {},
    create: {
      category_id: categoryTools.category_id,
      sku: 'HT-HO-002',
      name: 'จอบขุดดินพร้อมด้ามเหล็ก',
      description: 'เหล็กกล้าคาร์บอนสูง แข็งแรงทนทาน ไม่บิ่นง่าย',
      price: 180.00,
      weight: 1.5,
      stock_quantity: 50,
      is_active: true,
    },
  });

  const product6 = await prisma.product.upsert({
    where: { sku: 'HT-HS-020' }, update: {},
    create: {
      category_id: categoryTools.category_id,
      sku: 'HT-HS-020',
      name: 'สายยางรดน้ำเด้งดึ๋ง 20 เมตร พร้อมหัวฉีด',
      description: 'สายยางไม่พับ ไม่หักงอ ทนแดด ทนฝน',
      price: 390.00,
      weight: 2.8,
      stock_quantity: 40,
      is_active: true,
    },
  });

  const product7 = await prisma.product.upsert({
    where: { sku: 'SU-FE-005' }, update: {},
    create: {
      category_id: categorySupplies.category_id,
      sku: 'SU-FE-005',
      name: 'ปุ๋ยคอกขี้วัวนมตากแห้ง บรรจุ 5 กก.',
      description: 'ปุ๋ยอินทรีย์บำรุงดิน ผ่านการหมักและตากแห้ง ไร้กลิ่นรบกวน',
      price: 60.00,
      weight: 5.0,
      stock_quantity: 100,
      is_active: true,
    },
  });

  const product8 = await prisma.product.upsert({
    where: { sku: 'SU-TR-104' }, update: {},
    create: {
      category_id: categorySupplies.category_id,
      sku: 'SU-TR-104',
      name: 'ถาดเพาะกล้าไม้ 104 หลุม (แพ็ค 10 ใบ)',
      description: 'พลาสติกเหนียว ทนทาน ใช้ซ้ำได้หลายรอบ',
      price: 120.00,
      weight: 1.0,
      stock_quantity: 80,
      is_active: true,
    },
  });
  console.log('✅ 8 Products created successfully');

  // 7. สร้าง Discount
  const discount1 = await prisma.discount.upsert({
    where: { code: 'RAINY2026' }, update: {},
    create: { code: 'RAINY2026', discount_amount: 150.00, is_active: true },
  });

  // 8. จำลองการสร้าง Order
  let order = await prisma.order.findFirst({
    where: { customer_id: customer1.customer_id }
  });

  if (!order) {
    const total_price = (2590.00 * 1) + (350.00 * 2) - 150.00;

    order = await prisma.order.create({
      data: {
        customer_id: customer1.customer_id,
        discount_id: discount1.discount_id,
        total_amount: total_price,
        status: 'pending',
        order_items: {
          create: [
            { product_id: product1.product_id, quantity: 1, price_at_purchase: 2590.00 },
            { product_id: product3.product_id, quantity: 2, price_at_purchase: 350.00 }
          ]
        },
        payment: { create: { amount: total_price, payment_method: 'bank_transfer', status: 'pending' } },
        shipping: { create: { address_id: address.address_id, status: 'preparing' } }
      }
    });
  }

  console.log('--- 🌾 Seeding Completed Successfully ---');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
