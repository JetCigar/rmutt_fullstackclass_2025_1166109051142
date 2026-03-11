import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  // URL backend
  private apiUrl = 'http://localhost:9999/api/cart';

  constructor(private http: HttpClient) { }

  // ดึงตะกร้าสินค้าของลูกค้า
  getCart(customerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${customerId}`);
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