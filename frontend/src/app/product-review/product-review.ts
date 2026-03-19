import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './product-review.html',
  styleUrl: './product-review.html'
})
export class ReviewComponent {
  
  // รับค่า ID สินค้ามาจากหน้าแสดงรายละเอียดสินค้า (สมมติให้เป็น 1 ไว้ก่อนเพื่อทดสอบ)
  @Input() productId: number = 1; 

  // ตัวแปรสำหรับผูกกับฟอร์ม
  rating: number = 5;
  comment: string = '';

  constructor(private http: HttpClient) {}

  submitReview() {
    // 1. ดึง Token จาก LocalStorage ที่เก็บไว้ตอน Login
    const token = localStorage.getItem('token');

    // 2. เช็คว่ามี Token ไหม ถ้าไม่มีแปลว่ายังไม่ได้ล็อกอิน
    if (!token) {
      alert('กรุณาล็อกอินก่อนเขียนรีวิวครับ');
      // this.router.navigate(['/login']); // สามารถสั่งให้เด้งไปหน้า login ได้
      return;
    }

    // 3. นำ Token มาใส่ใน Header (จำลองสิ่งที่ทำในแท็บ Auth ของ Postman)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 4. เตรียมข้อมูลที่จะส่งไป (ไม่ต้องใส่ customer_id แล้ว)
    const body = {
      product_id: this.productId,
      rating: Number(this.rating),
      comment: this.comment
    };

    // 5. ยิง API ส่งข้อมูล
    this.http.post('http://localhost:9999/api/review/create', body, { headers })
      .subscribe({
        next: (res: any) => {
          console.log("Success:", res);
          alert('บันทึกรีวิวสำเร็จ! ขอบคุณสำหรับความคิดเห็นครับ');
          
          // ล้างค่าฟอร์มหลังจากส่งสำเร็จ
          this.comment = ''; 
          this.rating = 5;
          
          // TODO: อาจจะเขียนโค้ดเพื่อโหลดรายการรีวิวใหม่มาแสดงผลอัปเดตทันที
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