import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AccountSidebar } from '../account-sidebar/account-sidebar';
import { ShippingService, ShippingData } from '../services/shipping.service';

import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [NgStyle, HttpClientModule, AccountSidebar],
  templateUrl: './shipping.html',
  styleUrl: './shipping.css',
})
export class Shipping implements OnInit {
  shippings: ShippingData[] = [];
  loading = false;
  error = '';

  constructor(
    private shippingService: ShippingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadShippings();
  }

  loadShippings() {
    this.error = '';
    this.loading = true;

    const stored = localStorage.getItem('user');
    if (!stored) {
      this.loading = false;
      this.error = 'กรุณาเข้าสู่ระบบก่อนดูสถานะจัดส่ง';
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

    this.shippingService.getShippings(customerId)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (res) => {
          this.shippings = res.shippings || [];
        },
        error: (err) => {
          console.error('Failed to load shippings', err);
          this.error = err?.error?.message || 'ไม่สามารถโหลดสถานะการจัดส่งได้';
        },
      });
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      pending: '#ffa502',
      preparing: '#1fbc52',
      shipped: '#1fbc52',
      delivered: '#0f7965',
      cancelled: '#d64541',
      'รอดำเนินการ': '#ffa502',
    };
    return map[status.toLowerCase()] || '#868e96';
  }
}

