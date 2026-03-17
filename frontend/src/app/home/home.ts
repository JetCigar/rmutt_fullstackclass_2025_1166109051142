import { Component, OnInit, OnDestroy, signal } from '@angular/core';
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
  // ใช้ Signals เพื่อรองรับ Zoneless Change Detection
  categories = signal<any[]>([]);
  products = signal<ProductData[]>([]);

  days = signal('00');
  hours = signal('00');
  minutes = signal('00');
  seconds = signal('00');
  private timer: any;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.startCountdown();
    
    // ดึงข้อมูลตะกร้าเฉพาะเมื่อล็อกอินแล้ว
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const customerId = user.customer_id || user.id;
        if (customerId) {
          this.cartService.getCart(customerId).subscribe();
        }
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startCountdown() {
    // กำหนดเวลาสิ้นสุดเป็นสิ้นเดือนนี้
    const countdownDate = new Date();
    // ถ้าสิ้นเดือนเหลือเวลาน้อย เราจะจำลองให้เหลืออย่างน้อย 3 วันเพื่อความสวยงาม
    countdownDate.setMonth(countdownDate.getMonth() + 1);
    countdownDate.setDate(0);
    countdownDate.setHours(23, 59, 59);

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = countdownDate.getTime() - now;

      if (distance < 0) {
        if (this.timer) clearInterval(this.timer);
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      this.days.set(d.toString().padStart(2, '0'));
      this.hours.set(h.toString().padStart(2, '0'));
      this.minutes.set(m.toString().padStart(2, '0'));
      this.seconds.set(s.toString().padStart(2, '0'));
    };

    updateTimer();
    this.timer = setInterval(updateTimer, 1000);
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        let cats = data.categories || data;
        // แมปรูปภาพให้ตรงกับชื่อหมวดหมู่เพื่อความสวยงาม
        cats = cats.map((cat: any) => ({
          ...cat,
          image: this.getCategoryIcon(cat.name),
        }));
        this.categories.set(cats);
        console.log('HomeComponent: Categories loaded', this.categories());
      },
      error: (err) => {
        console.error('HomeComponent: Categories error', err);
      },
    });
  }

  getCategoryIcon(name: string): string {
    const iconMap: { [key: string]: string } = {
      เครื่องจักรกลการเกษตร:
        'https://th.bing.com/th/id/R.f337c256ee6216c9d6e0528251448267?rik=dwRtjhrrnfBixw&pid=ImgRaw&r=0',
      ระบบน้ำและข้อต่อ:
        'https://png.pngtree.com/png-clipart/20190925/original/pngtree-water-tap-icon-for-your-project-png-image_4892337.jpg',
      เครื่องตัดหญ้า:
        'https://tse3.mm.bing.net/th/id/OIP.OcZ3Du8KWZy6Sei2UJvf0QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      ปั๊มน้ำ:
        'https://th.bing.com/th/id/R.e8a2e02c19a2053719cb070f51e84ce9?rik=oLqn9LL%2fZonYoQ&pid=ImgRaw&r=0',
      เครื่องพ่นยา:
        'https://image.makewebeasy.net/makeweb/m_1200x600/2LYbR8tZ2/AfirstPage/HT767.png',
      ปุ๋ยและยา:
        'https://th.bing.com/th/id/OIP.P4k7f-KeaCttlP58k6Vy0wHaHa?w=201&h=200&c=7&r=0&o=7&pid=1.7&rm=3',
    };
    return iconMap[name] || 'https://cdn-icons-png.flaticon.com/512/1865/1865231.png';
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        const prods = data.products || data;
        this.products.set(prods);
        console.log('HomeComponent: Products loaded', this.products());
      },
      error: (err) => {
        console.error('HomeComponent: Products error', err);
      },
    });
  }

  // เพิ่มสินค้าลงตะกร้า
  addToCart(product: ProductData) {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า');
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const customerId = user.customer_id || user.id;

      if (!customerId) {
        alert('พบข้อผิดพลาดเกี่ยวกับข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
        this.router.navigate(['/login']);
        return;
      }

      const cartData = {
        customer_id: customerId,
        product_id: product.product_id,
        quantity: 1,
      };

      this.cartService.addToCart(cartData).subscribe({
        next: (response) => {
          console.log('Product added to cart:', response);
          // เมื่อเพิ่มเสร็จ ให้ดึงข้อมูลตะกร้าใหม่มาอัปเดต Signal ส่วนกลาง
          this.cartService.getCart(customerId).subscribe();
          alert('เพิ่มสินค้าลงตะกร้าแล้ว!');
        },
        error: (err) => {
          console.error('Error adding to cart:', err?.error || err);
          alert('ไม่สามารถเพิ่มสินค้าลงตะกร้าได้ในขณะนี้');
        },
      });
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      this.router.navigate(['/login']);
    }
  }
}
