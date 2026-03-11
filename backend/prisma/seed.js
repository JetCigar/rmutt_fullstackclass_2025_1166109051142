const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- 🌱 Start Seeding Agricultural Equipment Data ---');

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

  // 4. สร้าง Category
  const categories = [
    { id: 1, name: 'เครื่องจักรกลการเกษตร', desc: 'เครื่องตัดหญ้า, รถไถ, รถเกี่ยว' },
    { id: 2, name: 'ระบบน้ำและข้อต่อ', desc: 'ท่อ PE, ท่อ PVC, ข้อต่อต่างๆ' },
    { id: 3, name: 'เครื่องตัดหญ้า', desc: 'เครื่องตัดหญ้าสะพายบ่า, รถตัดหญ้า' },
    { id: 4, name: 'ปั๊มน้ำ', desc: 'ปั๊มน้ำหอยโข่ง, ปั๊มซับเมอร์ส' },
    { id: 5, name: 'เครื่องพ่นยา', desc: 'เครื่องพ่นยาแบตเตอรี่, ถังพ่นยา' },
    { id: 6, name: 'ปุ๋ยและยา', desc: 'ปุ๋ยเคมี, ปุ๋ยอินทรีย์, ยาฆ่าแมลง' },
  ];

  const catModels = {};
  for (const cat of categories) {
    catModels[cat.id] = await prisma.category.upsert({
      where: { category_id: cat.id },
      update: { name: cat.name },
      create: { category_id: cat.id, name: cat.name, description: cat.desc },
    });
  }
  console.log('✅ Categories created');

  // 5. สร้าง Products (12 รายการ)
  const products = [
    { sku: 'AG-BC-004', name: 'เครื่องตัดหญ้าสะพายบ่า 4 จังหวะ', price: 4500.00, catId: 3, img: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-WP-200', name: 'ปั๊มน้ำซับเมอร์ส 1.5HP (Solar)', price: 3200.00, catId: 4, img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-PE-100', name: 'ท่อ PE ขนาด 20mm (100 เมตร)', price: 800.00, catId: 2, img: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-SP-020', name: 'เครื่องพ่นยาแบตเตอรี่ 20 ลิตร', price: 1200.00, catId: 5, img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-HZ-001', name: 'รถเกี่ยวข้าวสมรรถภาพสูง', price: 850000.00, catId: 1, img: 'https://images.unsplash.com/photo-1592323860467-31034c568551?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-FT-555', name: 'ปุ๋ยเรือใบ 16-16-16 (50 กก.)', price: 1450.00, catId: 6, img: 'https://images.unsplash.com/photo-1628352081506-83c43143df6a?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-HT-101', name: 'จอบด้ามเหล็ก ตราค้างคาว', price: 250.00, catId: 1, img: 'https://images.unsplash.com/photo-1615821360172-870348705353?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-PM-300', name: 'เครื่องสูบน้ำหอยโข่ง 2 นิ้ว', price: 4200.00, catId: 4, img: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-DR-005', name: 'โดรนเพื่อการเกษตร DJI T30', price: 180000.00, catId: 1, img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-SD-999', name: 'เมล็ดพันธุ์ข้าวโพด (10 กก.)', price: 650.00, catId: 6, img: 'https://images.unsplash.com/photo-1524486483162-3bc424ac3ad6?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-BC-007', name: 'เครื่องตัดหญ้ารถเข็น 4 ล้อ', price: 8900.00, catId: 3, img: 'https://images.unsplash.com/photo-1589335300189-581173b3b022?auto=format&fit=crop&q=80&w=600' },
    { sku: 'AG-SP-016', name: 'เครื่องพ่นยาแบบสะพายเครื่องยนต์', price: 3800.00, catId: 5, img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=600' },
  ];

  for (const p of products) {
    const productModel = await prisma.product.upsert({
      where: { sku: p.sku },
      update: { name: p.name, price: p.price },
      create: { 
        category_id: catModels[p.catId].category_id, 
        sku: p.sku, 
        name: p.name, 
        price: p.price, 
        stock_quantity: 50 
      },
    });

    // เพิ่มรูปภาพ
    await prisma.productImage.upsert({
      where: { image_id: products.indexOf(p) + 1 }, // ใช้ index เป็น id ชั่วคราว
      update: { image_url: p.img },
      create: {
        image_id: products.indexOf(p) + 1,
        product_id: productModel.product_id,
        image_url: p.img,
        is_primary: true
      }
    });
  }
  console.log('✅ 12 Products & Images created successfully');

  console.log('--- 🌾 Seeding Completed Successfully ---');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });