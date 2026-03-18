import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from '../checkout/checkout';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutComponent],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {
  cartItems: any;
  totalPrice: any;
  totalItems: any;
  customerId: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItems = this.cartService.cartItems;
    this.totalPrice = this.cartService.cartTotal;
    this.totalItems = this.cartService.cartCount;
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.customerId = user.customer_id || user.id || 0;
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
    
    if (this.customerId) {
        this.loadCart();
    } else {
        // Handle unauthenticated state or default
    }
  }

selectedTotal = computed(() => {
  return this.selectedItems().reduce((sum, item) => {
    return sum + item.quantity * item.product.price;
  }, 0);
});

selectedCount = computed(() => {
  return this.selectedItems().length; // จำนวนรายการที่เลือก
});

selectedQuantity = computed(() => {
  return this.selectedItems().reduce((sum, item) => {
    return sum + item.quantity; // จำนวนชิ้นรวม
  }, 0);
});

selectedItems = signal<any[]>([]);

deleteSelected() {
  const selected = this.cartItems().filter((i: { selected: any; }) => i.selected);
  selected.forEach((i: any) => this.remove(i));
}

updateSelected() {
  const selected = this.cartItems().filter((item: any) => item.selected);
  this.selectedItems.set(selected);
}

isAllSelected = computed(() => {
  const items = this.cartItems();
  return items.length > 0 && items.every((item: any) => item.selected);
});

//  ฟังก์ชันเลือกทั้งหมด
toggleSelectAll() {
  const isAll = this.isAllSelected();

  const updated = this.cartItems().map((item: any) => ({
    ...item,
    selected: !isAll
  }));

  this.cartItems.set(updated);
  this.updateSelected();
}
  showCheckout = false;

  goCheckout(){
    if (this.selectedItems().length === 0) {
      alert('กรุณาเลือกสินค้าที่ต้องการชำระเงิน');
      return;
    }
    this.showCheckout = true;
  }

  openCheckout(){
    this.showCheckout = true;
  }

  continueShopping() {
    this.router.navigate(['/home']);
  }

  // โหลด cart
  loadCart() {
    this.cartService.getCart(this.customerId).subscribe({
      next: () => {

        const items = this.cartItems().map((item: any) => ({
          ...item,
          selected: item.selected ?? false // 🔥 เพิ่ม
        }));

        this.cartItems.set(items);
        this.updateSelected();

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
        this.updateSelected();
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