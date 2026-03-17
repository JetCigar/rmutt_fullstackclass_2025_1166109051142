import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AccountSidebar } from '../account-sidebar/account-sidebar';
import { ReviewService, ReviewData } from '../services/review.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [HttpClientModule, AccountSidebar],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review implements OnInit {
  reviews: ReviewData[] = [];
  loading = false;
  error = '';

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.error = '';
    this.loading = true;

    const stored = localStorage.getItem('user');
    if (!stored) {
      this.loading = false;
      this.error = 'กรุณาเข้าสู่ระบบก่อนดูรีวิว';
      return;
    }

    let user: any;
    try {
      user = JSON.parse(stored);
    } catch {
      this.loading = false;
      this.error = 'ข้อมูลผู้ใช้ไม่ถูกต้อง';
      return;
    }

    const customerId = user.customer_id ?? user.customerId;
    if (!customerId) {
      this.loading = false;
      this.error = 'ไม่พบเลขบัญชีผู้ใช้';
      return;
    }

    this.reviewService.getReviews(customerId)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (res) => {
          this.reviews = res.reviews || [];
        },
        error: (err) => {
          console.error('Failed to load reviews', err);
          this.error = err?.error?.message || 'ไม่สามารถโหลดรีวิวได้';
        },
      });
  }

  stars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }
}
