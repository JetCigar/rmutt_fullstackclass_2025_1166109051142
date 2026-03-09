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
  categories: any[] = [];
  products: ProductData[] = [];

  // ใช้ Signal เพื่อให้หน้าจออัปเดตแน่นอน
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
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data.categories || data;
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data.products || data; // ปรับตาม response structure
    });
  }
}
