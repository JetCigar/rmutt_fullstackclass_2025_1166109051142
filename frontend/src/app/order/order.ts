import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AccountSidebar } from '../account-sidebar/account-sidebar';
import { OrderService, OrderData } from '../services/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [HttpClientModule, AccountSidebar],
  templateUrl: './order.html',
  styleUrls: ['./order.css'],
})
export class Order implements OnInit {
  orders: OrderData[] = [];
  loading = false;
  error = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.error = '';
    this.loading = true;

    const stored = localStorage.getItem('user');
    if (!stored) {
      this.loading = false;
      this.error = 'กรุณาเข้าสู่ระบบก่อนดูคำสั่งซื้อ';
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

    this.orderService.getOrders(customerId)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (res) => {
          this.orders = res.orders || [];
        },
        error: (err) => {
          console.error('Failed to load orders', err);
          this.error = err?.error?.message || 'ไม่สามารถโหลดคำสั่งซื้อได้';
        },
      });
  }

  formatPrice(value: number) {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(value);
  }

  getTotal(order: OrderData) {
    return order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}

