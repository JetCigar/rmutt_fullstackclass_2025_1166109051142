import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AccountSidebar } from '../account-sidebar/account-sidebar';
import { AddressService, AddressData } from '../services/address.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, HttpClientModule, AccountSidebar],
  templateUrl: './address.html',
  styleUrl: './address.css',
})
export class Address implements OnInit {
  addresses: AddressData[] = [];
  loading = false;
  noData = false;
  error = '';

  constructor(
    private addressService: AddressService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.error = '';
    this.noData = false;
    this.loading = true;

    const stored = localStorage.getItem('user');
    if (!stored) {
      this.loading = false;
      this.error = 'กรุณาเข้าสู่ระบบก่อนดูที่อยู่';
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

    this.addressService.getAddresses(customerId)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (res) => {
          this.addresses = res.addresses || [];
          this.noData = !this.addresses.length;
          if (this.noData) {
            this.error = res?.message || 'ยังไม่มีที่อยู่ในระบบ';
          }
        },
        error: (err) => {
          console.error('Failed to load addresses', err);
          this.error = err?.error?.message || 'ไม่สามารถโหลดที่อยู่ได้';
        },
      });
  }

  formatAddress(address: AddressData) {
    return `${address.address_line}${address.province ? ', ' + address.province : ''}${address.zip_code ? ' ' + address.zip_code : ''}`;
  }
}
