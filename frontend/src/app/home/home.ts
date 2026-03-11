import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductService, ProductData } from '../../services/product.service';

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
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.startCountdown();
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
          image: this.getCategoryIcon(cat.name)
        }));
        this.categories.set(cats);
        console.log('HomeComponent: Categories loaded', this.categories());
      },
      error: (err) => {
        console.error('HomeComponent: Categories error', err);
      }
    });
  }

  getCategoryIcon(name: string): string {
    const iconMap: { [key: string]: string } = {
      'เครื่องจักรกลการเกษตร': 'https://cdn-icons-png.flaticon.com/512/2362/2362832.png',
      'ระบบน้ำและข้อต่อ': 'https://cdn-icons-png.flaticon.com/512/3100/3100063.png',
      'เครื่องตัดหญ้า': 'https://cdn-icons-png.flaticon.com/512/1500/1500511.png',
      'ปั๊มน้ำ': 'https://cdn-icons-png.flaticon.com/512/3105/3105900.png',
      'เครื่องพ่นยา': 'https://cdn-icons-png.flaticon.com/512/2942/2942813.png',
      'ปุ๋ยและยา': 'https://cdn-icons-png.flaticon.com/512/2682/2682781.png'
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
      }
    });
  }
}
