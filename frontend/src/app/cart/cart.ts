import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CheckoutAddress } from '../checkout/checkout-address/checkout-address';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,CheckoutAddress],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  totalPrice: number = 0;

  customerId: number = 1;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  goCheckout(){
    this.router.navigate(['/checkout/address'])
  }

  showCheckout = false;

  openCheckout(){
    this.showCheckout = true;
  }


  //ngOnInit(): void {
  //  this.loadCart();
  //}

  ngOnInit(): void {
    // mock data
    this.cartItems = [
      {
        cart_item_id: 999,
        quantity: 1,
        product: {
          name: "เครื่องตัดหญ้าทดลอง",
          sku: "MOCK-001",
          price: 500,
          stock_quantity: 10,
          category: {
            name: "สินค้าเกษตร"
          }
        }
      }
    ];
  
    this.calculateTotal();
  
    // โหลดของจริงจาก backend
    this.loadCart();
  }


  // โหลด cart
  loadCart() {
    this.cartService.getCart(this.customerId).subscribe({
      next: (data: any) => {
        this.cartItems = data;
        this.calculateTotal();
      },
      error: (err: any) => {
        console.error("โหลด cart ไม่สำเร็จ", err);
      }
    });
  }

  get totalItems(){
    return this.cartItems.reduce((sum,item)=>sum+item.quantity,0)
  }

  // คำนวณราคารวม
  calculateTotal() {
    this.totalPrice = 0;

    this.cartItems.forEach(item => {
      this.totalPrice += item.quantity * item.product.price;
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
        this.calculateTotal();

      });
  }

  // ลดจำนวน
  decrease(item: any) {

    if (item.quantity <= 1) return;

    const newQty = item.quantity - 1;

    this.cartService.updateCart(item.cart_item_id, newQty)
      .subscribe(() => {

        item.quantity = newQty;
        this.calculateTotal();

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

        this.cartItems = [];
        this.totalPrice = 0;

      });
  }

}