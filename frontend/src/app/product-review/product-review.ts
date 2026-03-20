import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './product-review.html',
  styleUrls: ['./product-review.css']
})
export class ReviewComponent implements OnInit, OnChanges {
  
  @Input() productId: number = 1; 
  @Input() showForm: boolean = true;
  @Output() reviewSubmitted = new EventEmitter<void>();

  // ตัวแปรสำหรับผูกกับฟอร์ม
  rating: number = 5;
  comment: string = '';

  // ตัวแปรเก็บรายการรีวิว
  reviews: any[] = [];
  loadingReviews = true;
  avgRating = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.productId) {
      this.loadReviews();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && !changes['productId'].isFirstChange() && this.productId) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.loadingReviews = true;
    this.http.get<any[]>(`http://localhost:9999/api/review/ReviewsByProduct/${this.productId}`)
      .subscribe({
        next: (data) => {
          this.reviews = data;
          if (data.length > 0) {
            this.avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          }
          this.loadingReviews = false;
        },
        error: () => {
          this.loadingReviews = false;
        }
      });
  }

  getStars(n: number): number[] {
    return Array(Math.round(n)).fill(0);
  }

  getEmptyStars(n: number): number[] {
    return Array(5 - Math.round(n)).fill(0);
  }

  submitReview() {
    // 1. ดึง Token จาก LocalStorage ที่เก็บไว้ตอน Login
    const token = localStorage.getItem('token');

    // 2. เช็คว่ามี Token ไหม ถ้าไม่มีแปลว่ายังไม่ได้ล็อกอิน
    if (!token) {
      alert('กรุณาล็อกอินก่อนเขียนรีวิวครับ');
      return;
    }

    // 3. นำ Token มาใส่ใน Header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 4. เตรียมข้อมูลที่จะส่งไป
    const body = {
      product_id: this.productId,
      rating: Number(this.rating),
      comment: this.comment
    };

    // 5. ยิง API ส่งข้อมูล
    this.http.post('http://localhost:9999/api/review/create', body, { headers })
      .subscribe({
        next: (res: any) => {
          alert('บันทึกรีวิวสำเร็จ! ขอบคุณสำหรับความคิดเห็นครับ');
          
          // ล้างค่าฟอร์มหลังจากส่งสำเร็จ
          this.comment = ''; 
          this.rating = 5;
          
          this.loadReviews(); // โหลดรีวิวใหม่ทันที
          this.reviewSubmitted.emit();
        },
        error: (err) => {
          console.error('Error:', err);
          if (err.status === 401) {
            alert('เซสชันหมดอายุ หรือ Token ไม่ถูกต้อง กรุณาล็อกอินใหม่');
          } else {
            alert(err.error?.message || 'เกิดข้อผิดพลาดในการส่งรีวิว');
          }
        }
      });
  }
}