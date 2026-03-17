import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductService, ProductData } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class HomeComponent implements OnInit, OnDestroy {
  // 1. ตัวแปรเก็บข้อมูล (ใช้ Array ปกติเพื่อง่ายต่อการอธิบาย)
  categories: any[] = [];
  products: ProductData[] = [];

  // 2. ตัวแปรสำหรับตัวนับเวลา (Countdown)
  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';
  private timer: any;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // เรียกทำงานเมื่อ Component เริ่มต้น
    this.loadCategories();
    this.loadProducts();
    this.startCountdown();
    this.initCart();
  }

  ngOnDestroy(): void {
    // ล้าง Timer เมื่อออกจากหน้านี้
    if (this.timer) clearInterval(this.timer);
  }

  // ฟังก์ชั่นเริ่มต้นข้อมูลตะกร้า
  initCart() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const customerId = user.customer_id || user.id;
      if (customerId) {
        this.cartService.getCart(customerId).subscribe();
      }
    }
  }

  // โหลดหมวดหมู่สินค้า
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        const data = res.categories || res;
        // แมปรูปภาพให้ตรงกับชื่อหมวดหมู่ (แบบง่าย)
        this.categories = data.map((cat: any) => ({
          ...cat,
          image: this.getIcon(cat.name)
        }));
        this.cdr.detectChanges();
      }
    });
  }

  // โหลดรายการสินค้า
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.products || res;
        this.cdr.detectChanges();
      }
    });
  }

  // จัดการตัวนับเวลาถอยหลัง (Countdown)
  startCountdown() {
    const target = new Date();
    target.setHours(23, 59, 59); // สิ้นสุดเวลาเที่ยงคืนวันนี้

    this.timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;

      if (diff <= 0) {
        clearInterval(this.timer);
        return;
      }

      // คำนวณ ชม. นาที วินาที
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      this.hours = h.toString().padStart(2, '0');
      this.minutes = m.toString().padStart(2, '0');
      this.seconds = s.toString().padStart(2, '0');
    }, 1000);
  }

  // เพิ่มสินค้าลงตะกร้า
  addToCart(product: ProductData) {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('กรุณาเข้าสู่ระบบก่อนครับ');
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(storedUser);
    const customerId = user.customer_id || user.id;

    if (!customerId) return;

    const payload = {
      customer_id: customerId,
      product_id: product.product_id,
      quantity: 1
    };

    this.cartService.addToCart(payload).subscribe({
      next: () => {
        alert('เพิ่ม ' + product.name + ' ลงตะกร้าแล้ว!');
        // รีเฟรชข้อมูลตะกร้า
        this.cartService.getCart(customerId).subscribe();
      },
      error: () => alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า')
    });
  }

  // ฟังก์ชั่นช่วยเลือกไอคอน
  getIcon(name: string): string {
    const icons: any = {
      'เครื่องจักรกลการเกษตร': 'https://th.bing.com/th/id/R.f337c256ee6216c9d6e0528251448267?rik=dwRtjhrrnfBixw&pid=ImgRaw&r=0',
      'ระบบน้ำและข้อต่อ': 'https://png.pngtree.com/png-clipart/20190925/original/pngtree-water-tap-icon-for-your-project-png-image_4892337.jpg',
      'เครื่องตัดหญ้า': 'https://tse3.mm.bing.net/th/id/OIP.OcZ3Du8KWZy6Sei2UJvf0QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      'ปั๊มน้ำ': 'https://th.bing.com/th/id/R.e8a2e02c19a2053719cb070f51e84ce9?rik=oLqn9LL%2fZonYoQ&pid=ImgRaw&r=0',
      'เครื่องพ่นยา': 'https://image.makewebeasy.net/makeweb/m_1200x600/2LYbR8tZ2/AfirstPage/HT767.png',
      'ปุ๋ยและยา': 'https://th.bing.com/th/id/OIP.P4k7f-KeaCttlP58k6Vy0wHaHa?w=201&h=200&c=7&r=0&o=7&pid=1.7&rm=3'
    };
    return icons[name] || 'https://cdn-icons-png.flaticon.com/512/1865/1865231.png';
  }
}
