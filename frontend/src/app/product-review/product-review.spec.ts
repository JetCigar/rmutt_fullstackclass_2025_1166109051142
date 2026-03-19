import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-review.html',
  styleUrls: ['./product-review.css']
})
export class ReviewCardComponent {
  private fb = inject(FormBuilder);

  // ข้อมูลสถิติ (Mock Data)
  ratingStats = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  // ใช้ Signal จัดการสถานะการเปิด/ปิดฟอร์ม
  showForm = signal(false);

  // Reactive Form แบบ Strongly Typed
  reviewForm = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  toggleForm() {
    this.showForm.update(v => !v);
  }

  submitReview() {
    if (this.reviewForm.valid) {
      console.log('Review Data:', this.reviewForm.value);
      // Logic ส่งข้อมูลไป API...
      this.showForm.set(false);
      this.reviewForm.reset({ rating: 5, comment: '' });
    }
  }
}