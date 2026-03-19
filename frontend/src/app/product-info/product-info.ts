import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductInfoService, ProductDetail} from '../../services/productInfo';
import { DecimalPipe ,CommonModule } from '@angular/common';
import { ReviewComponent } from'../product-review/product-review';

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
    private cdr: ChangeDetectorRef
    
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
}
