import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddressData {
  address_id: number;
  customer_id: number;
  address_line: string;
  province: string;
  zip_code: string;
  is_default: boolean;
  phone?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly apiBase = 'http://localhost:9999/auth';

  constructor(private http: HttpClient) {}

  getAddresses(customerId: number): Observable<{ addresses: AddressData[]; message?: string }> {
    return this.http.get<{ addresses: AddressData[]; message?: string }>(`${this.apiBase}/addresses/${customerId}`);
  }

  addAddress(payload: any): Observable<{ address: AddressData; message: string }> {
    return this.http.post<{ address: AddressData; message: string }>(`${this.apiBase}/addresses`, payload);
  }

  deleteAddress(addressId: number): Observable<{ message: string; address_id: number }> {
    return this.http.delete<{ message: string; address_id: number }>(`${this.apiBase}/addresses/${addressId}`);
  }
}
