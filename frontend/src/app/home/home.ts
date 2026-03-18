import { Component, OnInit, OnDestroy, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoryService, CategoryData } from '../../services/category.service';
import { ProductService, ProductData } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

import { HeroBannerComponent } from './hero-banner/hero-banner';
import { FeatureBarComponent } from './feature-bar/feature-bar';
import { PromoCountdownComponent } from './promo-countdown/promo-countdown';
import { CategoryGridComponent } from './category-grid/category-grid';
import { ProductGridComponent } from './product-grid/product-grid';

interface HomeCategory extends CategoryData {
  image?: string;
  product_count?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HeroBannerComponent,
    FeatureBarComponent,
    PromoCountdownComponent,
    CategoryGridComponent,
    ProductGridComponent,
  ],
})
export class HomeComponent implements OnInit {
  categories = signal<HomeCategory[]>([]);
  products = signal<ProductData[]>([]);
  isLoadingCategories = signal(true);
  isLoadingProducts = signal(true);

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.initCart();
  }

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

  loadCategories() {
    this.isLoadingCategories.set(true);
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        const cats: CategoryData[] = (data as any).categories || data;
        const catsWithImages: HomeCategory[] = cats.map((cat) => ({
          ...cat,
          image: this.getCategoryIcon(cat.name),
        }));
        this.categories.set(catsWithImages);
        this.isLoadingCategories.set(false);
      },
      error: () => this.isLoadingCategories.set(false),
    });
  }

  getCategoryIcon(name: string): string {
    const iconMap: { [key: string]: string } = {
      เครื่องจักรกลการเกษตร: 'https://th.bing.com/th/id/R.f337c256ee6216c9d6e0528251448267?rik=dwRtjhrrnfBixw&pid=ImgRaw&r=0',
      ระบบน้ำและข้อต่อ: 'https://png.pngtree.com/png-clipart/20190925/original/pngtree-water-tap-icon-for-your-project-png-image_4892337.jpg',
      เครื่องตัดหญ้า: 'https://tse3.mm.bing.net/th/id/OIP.OcZ3Du8KWZy6Sei2UJvf0QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      ปั๊มน้ำ: 'https://th.bing.com/th/id/R.e8a2e02c19a2053719cb070f51e84ce9?rik=oLqn9LL%2fZonYoQ&pid=ImgRaw&r=0',
      เครื่องพ่นยา: 'https://image.makewebeasy.net/makeweb/m_1200x600/2LYbR8tZ2/AfirstPage/HT767.png',
      ปุ๋ยและยา: 'https://th.bing.com/th/id/OIP.P4k7f-KeaCttlP58k6Vy0wHaHa?w=201&h=200&c=7&r=0&o=7&pid=1.7&rm=3',
    };
    return iconMap[name] || 'https://cdn-icons-png.flaticon.com/512/1865/1865231.png';
  }

  loadProducts() {
    this.isLoadingProducts.set(true);
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products.set(data.products || data);
        this.isLoadingProducts.set(false);
      },
      error: () => this.isLoadingProducts.set(false),
    });
  }

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

    this.cartService.addToCart({ customer_id: customerId, product_id: product.product_id, quantity: 1 }).subscribe({
      next: () => {
        alert('เพิ่ม ' + product.name + ' ลงตะกร้าแล้ว!');
        this.cartService.getCart(customerId).subscribe();
      },
      error: () => alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า'),
    });
  }
}
