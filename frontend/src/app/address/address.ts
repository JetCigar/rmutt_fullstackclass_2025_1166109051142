import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AccountSidebar } from '../account-sidebar/account-sidebar';
import { AddressService, AddressData } from '../services/address.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [HttpClientModule, AccountSidebar, FormsModule],
  templateUrl: './address.html',
  styleUrl: './address.css',
})
export class Address implements OnInit {
  addresses: AddressData[] = [];
  loading = false;
  error = '';

  showAddForm = false;
  saving = false;
  newAddressLine = '';
  newProvince = '';
  newZipCode = '';
  newIsDefault = false;

  constructor(
    private addressService: AddressService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAddresses();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  private resetForm() {
    this.newAddressLine = '';
    this.newProvince = '';
    this.newZipCode = '';
    this.newIsDefault = false;
    this.error = '';
  }

  saveNewAddress() {
    if (!this.newAddressLine.trim()) {
      this.error = 'กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน';
      return;
    }

    const stored = localStorage.getItem('user');
    if (!stored) return;

    let user: any;
    try {
      user = JSON.parse(stored);
    } catch {
      return;
    }

    const customerId = user.customer_id ?? user.customerId;
    if (!customerId) return;

    this.saving = true;
    this.error = '';

    const payload = {
      customer_id: customerId,
      address_line: this.newAddressLine,
      province: this.newProvince,
      zip_code: this.newZipCode,
      is_default: this.newIsDefault,
    };

    this.addressService.addAddress(payload)
      .pipe(finalize(() => {
        this.saving = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (res) => {
          this.addresses.unshift(res.address);
          this.toggleAddForm();
        },
        error: (err) => {
          console.error('Failed to add address', err);
          this.error = err?.error?.message || 'ไม่สามารถเพิ่มที่อยู่ได้';
        }
      });
  }

  loadAddresses() {
    this.error = '';
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

  deleteAddress(addressId: number) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?')) {
      return;
    }

    this.addressService.deleteAddress(addressId)
      .pipe(finalize(() => {
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.addresses = this.addresses.filter(a => a.address_id !== addressId);
        },
        error: (err) => {
          console.error('Failed to delete address', err);
          alert(err?.error?.message || 'ไม่สามารถลบที่อยู่ได้');
        }
      });
  }
}
