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
    { sku: 'AG-BC-004', name: 'เครื่องตัดหญ้าสะพายบ่า 4 จังหวะ', price: 4500.00, catId: 3, img: 'https://tse1.mm.bing.net/th/id/OIP.bACv0mtN21LaNUdvKrMtkQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { sku: 'AG-WP-200', name: 'ปั๊มน้ำซับเมอร์ส 1.5HP (Solar)', price: 3200.00, catId: 4, img: 'https://tse4.mm.bing.net/th/id/OIP.Iqx4lvmwlpckVI5vTrTyYQHaNK?w=1350&h=2400&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { sku: 'AG-PE-100', name: 'ท่อ PE ขนาด 20mm (100 เมตร)', price: 800.00, catId: 2, img: 'https://tse2.mm.bing.net/th/id/OIP.yJRCosQK5nGnHJzPwPYo1wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { sku: 'AG-SP-020', name: 'เครื่องพ่นยาแบตเตอรี่ 20 ลิตร', price: 1200.00, catId: 5, img: 'https://tse1.mm.bing.net/th/id/OIP.KfkIKRdnQ2qQ-7pCVgRQGAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { sku: 'AG-HZ-001', name: 'รถเกี่ยวข้าวสมรรถภาพสูง', price: 850000.00, catId: 1, img: 'https://tse2.mm.bing.net/th/id/OIP.jSq0rOB9pDR7D6CB8c6ChAHaFc?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { sku: 'AG-FT-555', name: 'ปุ๋ยเรือใบ 16-16-16 (50 กก.)', price: 1450.00, catId: 6, img: 'https://img.lazcdn.com/g/p/bca33cc2ef5884c8a6c431b4209f9c4e.png_720x720q80.png_.webp' },
    { sku: 'AG-HT-101', name: 'จอบด้ามเหล็ก ตราค้างคาว', price: 250.00, catId: 1, img: 'https://tse4.mm.bing.net/th/id/OIP.WBgW9ZsQRrkJw6srpIjVpAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { sku: 'AG-PM-300', name: 'เครื่องสูบน้ำหอยโข่ง 2 นิ้ว', price: 4200.00, catId: 4, img: 'https://th.bing.com/th/id/OIP.8HY2lUO8jQF7xdPwsL4gjwHaFj?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { sku: 'AG-DR-005', name: 'โดรนเพื่อการเกษตร DJI T30', price: 180000.00, catId: 1, img: 'https://www.kubotasanvithayu.com/uploads/7132/shop/202203/202203-30-140744_CY-0.jpg' },
    { sku: 'AG-SD-999', name: 'เมล็ดพันธุ์ข้าวโพด (10 กก.)', price: 650.00, catId: 6, img: 'https://img.lazcdn.com/g/p/0cd4c8c51adbe1bbf331bfd5ecf2efa5.jpg_720x720q80.jpg' },
    { sku: 'AG-BC-007', name: 'เครื่องตัดหญ้ารถเข็น 4 ล้อ', price: 8900.00, catId: 3, img: 'https://cf.shopee.co.th/file/48266a0644b635b655222be830e9d70d' },
    { sku: 'AG-SP-016', name: 'เครื่องพ่นยาแบบสะพายเครื่องยนต์', price: 3800.00, catId: 5, img: 'https://tse4.mm.bing.net/th/id/OIP.5Ltxjez8CQfZigjuQX-XmAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
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