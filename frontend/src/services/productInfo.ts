import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// กำหนด Interface ให้ตรงกับ JSON ที่ Backend ส่งมาเป๊ะๆ
export interface ProductDetail {
  product_id: number;
  category_id: number;
  sku: string;
  name: string;
  description: string;
  price: string;
  weight: number | null;
  stock_quantity: number;
  attributes: any;
  category: {
    category_id: number;
    name: string;
    description: string;
  };
  images: {
    image_id: number;
    image_url: string;
    is_primary: boolean;
  }[];
  reviews: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductInfoService {
  // URL ต้องตรงกับที่ตั้งไว้ใน index.js (Backend)
  private apiUrl = 'http://localhost:9999/api/productInfo'; 

  constructor(private http: HttpClient) { }

  /**
   * ดึงข้อมูลรายละเอียดสินค้าตาม ID
   * @param id รหัสสินค้า
   */
  getProductDetail(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiUrl}/${id}`);
  }
}