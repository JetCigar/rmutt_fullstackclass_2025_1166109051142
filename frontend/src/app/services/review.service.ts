import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReviewData {
  review_id: number;
  product_id: number;
  product_name: string;
  customer_id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly apiBase = 'http://localhost:9999/auth';

  constructor(private http: HttpClient) {}

  getReviews(customerId: number): Observable<{ reviews: ReviewData[]; message?: string }> {
    return this.http.get<{ reviews: ReviewData[]; message?: string }>(`${this.apiBase}/reviews/${customerId}`);
  }
}
