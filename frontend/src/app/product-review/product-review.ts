import { Component } from '@angular/core';

@Component({
  selector: 'app-product-review',
  imports: [],
  templateUrl: './product-review.html',
  styleUrl: './product-review.css',
})
export class ReviewComponent {
  // จำลองข้อมูลจาก Database/API
  ratingStats = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 }
  ];
}
