import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  // URL backend
  private apiUrl = 'http://localhost:9999/api/cart';

  // State ส่วนกลางแบบ Signal
  cartItems = signal<any[]>([]);

  // Computed signals เพื่อนำไปใช้แสดงผล
  cartCount = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  cartTotal = computed(() => {
    let currentTotal = 0;
    this.cartItems().forEach(item => {
      currentTotal += item.quantity * item.product.price;
    });
    return currentTotal;
  });

  constructor(private http: HttpClient) { }

  // ดึงตะกร้าสินค้าของลูกค้า
  getCart(customerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${customerId}`).pipe(
      tap((data: any) => {
        const items = Array.isArray(data) ? data : [];
        this.cartItems.set(items);
      })
    );
  }

  // เพิ่มสินค้าเข้าตะกร้า
  addToCart(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // อัปเดตจำนวนสินค้า
  updateCart(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${cartItemId}`, { quantity });
  }

  // ลบสินค้าออกจาก cart
  removeItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${cartItemId}`);
  }

  // ล้าง cart ทั้งหมด
  clearCart(customerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/customer/${customerId}`);
  }

}