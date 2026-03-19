import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductInfoService, ProductDetail} from '../../services/productInfo';
import { DecimalPipe ,CommonModule } from '@angular/common';
import { ReviewComponent } from'../product-review/product-review';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-info',
  imports: [DecimalPipe,CommonModule,ReviewComponent],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css',
  standalone: true
})
export class ProductInfo implements OnInit {
  product?: ProductDetail;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productInfoService: ProductInfoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cartService: CartService
  ) {}
  // สร้างตัวแปรเก็บจำนวน (ค่าเริ่มต้นเป็น 1)
quantity: number = 1;

  // ฟังก์ชันเพิ่มจำนวน
  increment() {
    if (this.quantity) {
      this.quantity++;
    }
  }

  // ฟังก์ชันลดจำนวน
  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'null') {
      this.productInfoService.getProductDetail(Number(id)).subscribe({
        next: (data) => {
          this.product = data;
          this.isLoading = false;
          this.cdr.detectChanges(); // 3. สั่งให้ Angular วาดหน้าจอใหม่ทันที
          console.log('UI Updated!');
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  // ฟังก์ชันเพิ่มสินค้าลงตะกร้า
  addToCart() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า');
      this.router.navigate(['/login']);
      return;
    }
    
    const user = JSON.parse(userStr);
    const customerId = user.customer_id || user.id;

    if (!this.product) return;

    const payload = {
      customer_id: customerId,
      product_id: this.product.product_id,
      quantity: this.quantity
    };

    this.cartService.addToCart(payload).subscribe({
      next: (res) => {
        alert('เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว');
        // ให้ Header อัปเดตตัวเลขจำนวนสินค้าแบบเรียลไทม์
        this.cartService.getCart(customerId).subscribe();
      },
      error: (err) => {
        console.error('Add to cart failed', err);
        alert('เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า');
      }
    });
  }
}
