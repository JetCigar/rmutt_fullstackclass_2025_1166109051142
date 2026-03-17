import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface OrderData {
  id: string;
  date: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  payment_status?: string | null;
  shipping_status?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiBase = 'http://localhost:9999/auth';

  constructor(private http: HttpClient) {}

  getOrders(customerId: number): Observable<{ orders: OrderData[]; message?: string }> {
    return this.http.get<{ orders: OrderData[]; message?: string }>(`${this.apiBase}/orders/${customerId}`);
  }

  createOrder(payload: any): Observable<any> {
    return this.http.post(`${this.apiBase}/orders/create`, payload);
  }
}
