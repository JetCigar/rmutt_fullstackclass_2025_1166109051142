import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {
  cartItems: any;
  totalPrice: any;
  totalItems: any;
  customerId: number = 1;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItems = this.cartService.cartItems;
    this.totalPrice = this.cartService.cartTotal;
    this.totalItems = this.cartService.cartCount;
  }

  goCheckout(){
    this.router.navigate(['/checkout/address'])
  }

  showCheckout = false;

  openCheckout(){
    this.showCheckout = true;
  }

  continueShopping() {
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {
    this.loadCart();
  }




  // โหลด cart
  loadCart() {
    this.cartService.getCart(this.customerId).subscribe({
      next: () => {
        // ค่าใน Signal cartItems จะถูกอัปเดตจาก service แล้ว
      },
      error: (err: any) => {
        console.error("โหลด cart ไม่สำเร็จ", err);
      }
    });
  }

  // เพิ่มจำนวน
  increase(item: any) {

    const newQty = item.quantity + 1;

    if (newQty > item.product.stock_quantity) {
      alert("สินค้าในสต็อกไม่พอ");
      return;
    }

    this.cartService.updateCart(item.cart_item_id, newQty)
      .subscribe(() => {

        item.quantity = newQty;
        // บังคับให้ signal trigger การเปลี่ยนค่า
        this.cartItems.set([...this.cartItems()]);
      });
  }

  // ลดจำนวน
  decrease(item: any) {

    if (item.quantity <= 1) return;

    const newQty = item.quantity - 1;

    this.cartService.updateCart(item.cart_item_id, newQty)
      .subscribe(() => {

        item.quantity = newQty;
        // บังคับให้ signal trigger การเปลี่ยนค่า
        this.cartItems.set([...this.cartItems()]);
      });
  }

  // ลบสินค้า
  remove(item: any) {

    if (!confirm("ต้องการลบสินค้านี้หรือไม่?")) return;

    this.cartService.removeItem(item.cart_item_id)
      .subscribe(() => {

        this.loadCart();

      });
  }

    // ล้างตะกร้า
  clearCart() {
    if (!confirm("ต้องการล้างตะกร้าหรือไม่?")) return;

    this.cartService.clearCart(this.customerId)
      .subscribe(() => {
        this.cartService.cartItems.set([]); // อัปเดต state
      });
  }

}