import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface ProductData {
  product_id: number;
  category_id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  stock_quantity: number;
  attributes: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
}

export interface ProductImage {
  image_id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:9999/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductData[]> {
    return this.http.get<ProductData[]>(`${this.apiUrl}/test-product`);
  }
}





   
    