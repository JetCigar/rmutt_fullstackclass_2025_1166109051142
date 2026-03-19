import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-promotion',
  imports: [CommonModule],
  templateUrl: './promotion.html',
  styleUrl: './promotion.css',
})
export class Promotion implements OnInit {
  allProducts: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((res: any) => {
      const categories = res.categories;
      this.allProducts = categories.reduce((acc: any[], category: any) => {
        if (category.products && category.products.length > 0) {
          return acc.concat(category.products);
        }
        return acc;
      }, []);
      this.cdr.detectChanges();
    });
  }

  viewProductDetail(product: any) {
    this.router.navigate(['/product-info', product.product_id]);
  }

  addToCart(product: any, event: Event) {
    event.stopPropagation(); // Prevent navigating to product detail when clicking add to cart

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
        alert(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`);
        // Refresh cart indicator in navbar by calling getCart
        this.cartService.getCart(customerId).subscribe();
      },
      error: () => alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า'),
    });
  }

  getOriginalPrice(price: number | string): number {
    const p = Number(price);
    // Based on the image showing 3200 becomes 3840 (which is exactly +20% / * 1.2)
    return p * 1.2;
  }
}
