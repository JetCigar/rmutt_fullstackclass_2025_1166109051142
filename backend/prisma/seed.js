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
    { 
      sku: 'AG-BC-004', 
      name: 'เครื่องตัดหญ้าสะพายบ่า 4 จังหวะ', 
      description: 'เครื่องตัดหญ้าสะพายบ่า 4 จังหวะ ใช้งานง่าย สตาร์ทติดง่าย ประหยัดน้ำมัน เสียงเบา เหมาะสำหรับตัดหญ้าในสวนหรือพื้นที่กว้าง',
      price: 4500.00, 
      catId: 3, 
      img: 'https://tse1.mm.bing.net/th/id/OIP.bACv0mtN21LaNUdvKrMtkQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' 
    },
    { 
      sku: 'AG-WP-200', 
      name: 'ปั๊มน้ำซับเมอร์ส 1.5HP (Solar)', 
      description: 'ปั๊มน้ำบาดาลซับเมอร์ส พลังงานแสงอาทิตย์ 1.5 แรงม้า ประหยัดค่าไฟ 100% เหมาะสำหรับพื้นที่เกษตรที่ไฟฟ้าเข้าไม่ถึง',
      price: 3200.00, 
      catId: 4, 
      img: 'https://tse4.mm.bing.net/th/id/OIP.Iqx4lvmwlpckVI5vTrTyYQHaNK?w=1350&h=2400&rs=1&pid=ImgDetMain&o=7&rm=3' 
    },
    { 
      sku: 'AG-PE-100', 
      name: 'ท่อ PE ขนาด 20mm (100 เมตร)', 
      description: 'ท่อ PE ความยาว 100 เมตร ขนาด 20 มิลลิเมตร เนื้อเหนียว ยืดหยุ่นสูง ทนทานต่อแรงดันน้ำและแสง UV สำหรับระบบน้ำหยดและสปริงเกลอร์',
      price: 800.00, 
      catId: 2, 
      img: 'https://tse2.mm.bing.net/th/id/OIP.yJRCosQK5nGnHJzPwPYo1wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' 
    },
    { 
      sku: 'AG-SP-020', 
      name: 'เครื่องพ่นยาแบตเตอรี่ 20 ลิตร', 
      description: 'เครื่องพ่นยาแบบสะพายหลัง ระบบแบตเตอรี่ ความจุ 20 ลิตร ใช้งานสะดวก ไม่ต้องออกแรงโยก แบตเตอรี่ทนทานใช้งานได้ต่อเนื่องยาวนาน',
      price: 1200.00, 
      catId: 5, 
      img: 'https://tse1.mm.bing.net/th/id/OIP.KfkIKRdnQ2qQ-7pCVgRQGAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' 
    },
    { 
      sku: 'AG-HZ-001', 
      name: 'รถเกี่ยวข้าวสมรรถภาพสูง', 
      description: 'รถเกี่ยวข้าวสมรรถนะสูง เครื่องยนต์ทรงพลัง ทำงานได้รวดเร็ว ลดการสูญเสียของเมล็ดข้าว ช่วยลดระยะเวลาและต้นทุนในการเก็บเกี่ยว',
      price: 850000.00, 
      catId: 1, 
      img: 'https://tse2.mm.bing.net/th/id/OIP.jSq0rOB9pDR7D6CB8c6ChAHaFc?rs=1&pid=ImgDetMain&o=7&rm=3' 
    },
    { 
      sku: 'AG-FT-555', 
      name: 'ปุ๋ยเรือใบ 16-16-16 (50 กก.)', 
      description: 'ปุ๋ยเคมีสูตรเสมอ 16-16-16 ตราเรือใบไข่มุก บำรุงต้น ใบ ดอก และผล ช่วยให้พืชเจริญเติบโตอย่างสมบูรณ์ บรรจุกระสอบ 50 กิโลกรัม',
      price: 1450.00, 
      catId: 6, 
      img: 'https://img.lazcdn.com/g/p/bca33cc2ef5884c8a6c431b4209f9c4e.png_720x720q80.png_.webp' 
    },
    { 
      sku: 'AG-HT-101', 
      name: 'จอบด้ามเหล็ก ตราค้างคาว', 
      description: 'จอบขุดดินพร้อมด้ามเหล็กเชื่อมติด แข็งแรง ทนทานเป็นพิเศษ น้ำหนักกำลังดี เหมาะสำหรับงานขุดดิน แซะร่อง และถากหญ้า',
      price: 250.00, 
      catId: 1, 
      img: 'https://tse4.mm.bing.net/th/id/OIP.WBgW9ZsQRrkJw6srpIjVpAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' 
    },
    { 
      sku: 'AG-PM-300', 
      name: 'เครื่องสูบน้ำหอยโข่ง 2 นิ้ว', 
      description: 'เครื่องสูบน้ำแบบหอยโข่ง ขนาดท่อเข้า-ออก 2 นิ้ว มอเตอร์กำลังสูง ส่งน้ำได้ไกลและได้ปริมาณน้ำมาก เหมาะสำหรับงานชลประทานในแปลงเกษตร',
      price: 4200.00, 
      catId: 4, 
      img: 'https://th.bing.com/th/id/OIP.8HY2lUO8jQF7xdPwsL4gjwHaFj?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3' 
    },
    { 
      sku: 'AG-DR-005', 
      name: 'โดรนเพื่อการเกษตร DJI T30', 
      description: 'โดรนเพื่อการเกษตร DJI รุ่น T30 ถังบรรจุน้ำยาขนาดใหญ่ 30 ลิตร รัศมีการพ่นกว้าง ทำงานอัตโนมัติ แม่นยำ เพิ่มประสิทธิภาพในแปลงขนาดใหญ่',
      price: 180000.00, 
      catId: 1, 
      img: 'https://www.kubotasanvithayu.com/uploads/7132/shop/202203/202203-30-140744_CY-0.jpg' 
    },
    { 
      sku: 'AG-SD-999', 
      name: 'เมล็ดพันธุ์ข้าวโพด (10 กก.)', 
      description: 'เมล็ดพันธุ์ข้าวโพดเลี้ยงสัตว์ลูกผสมคุณภาพสูง อัตราการงอกดีเยี่ยม ลำต้นแข็งแรง ทนแล้งและโรคพืช ให้ผลผลิตต่อไร่สูง บรรจุ 10 กิโลกรัม',
      price: 650.00, 
      catId: 6, 
      img: 'https://img.lazcdn.com/g/p/0cd4c8c51adbe1bbf331bfd5ecf2efa5.jpg_720x720q80.jpg' 
    },
    { 
      sku: 'AG-BC-007', 
      name: 'เครื่องตัดหญ้ารถเข็น 4 ล้อ', 
      description: 'เครื่องตัดหญ้าแบบรถเข็น 4 ล้อ เครื่องยนต์เบนซิน เข็นง่าย เบาแรง มีความสูงระดับการตัดที่ปรับได้ ช่วยให้การตัดหญ้าในพื้นที่ราบเรียบสม่ำเสมอ',
      price: 8900.00, 
      catId: 3, 
      img: 'https://cf.shopee.co.th/file/48266a0644b635b655222be830e9d70d' 
    },
    { 
      sku: 'AG-SP-016', 
      name: 'เครื่องพ่นยาแบบสะพายเครื่องยนต์', 
      description: 'เครื่องพ่นยาสะพายหลังแบบเครื่องยนต์ เคลื่อนย้ายสะดวก ปั๊มแรงดันสูง ละอองฝอยละเอียด พ่นได้ไกล เหมาะสำหรับสวนผลไม้และแปลงเกษตร',
      price: 3800.00, 
      catId: 5, 
      img: 'https://tse4.mm.bing.net/th/id/OIP.5Ltxjez8CQfZigjuQX-XmAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' 
    },
  ];

  for (const p of products) {
    const productModel = await prisma.product.upsert({
      where: { sku: p.sku },
      update: { name: p.name, price: p.price, description: p.description },
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
