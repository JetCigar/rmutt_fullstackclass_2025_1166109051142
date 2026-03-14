import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShippingData {
  shipping_id: number;
  order_id: number;
  order_code: string;
  tracking_number: string;
  status: string;
  shipped_at: string;
  address: string;
}

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private readonly apiBase = 'http://localhost:9999/auth';

  constructor(private http: HttpClient) {}

  getShippings(customerId: number): Observable<{ shippings: ShippingData[]; message?: string }> {
    return this.http.get<{ shippings: ShippingData[]; message?: string }>(`${this.apiBase}/shippings/${customerId}`);
  }
}
