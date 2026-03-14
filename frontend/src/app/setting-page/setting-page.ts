import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountSidebar } from '../account-sidebar/account-sidebar';
import { AccountService, ProfileData, UpdateProfilePayload } from '../services/account.service';

@Component({
  selector: 'app-setting-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AccountSidebar],
  templateUrl: './setting-page.html',
  styleUrl: './setting-page.css',
})
export class SettingPage implements OnInit {
  constructor(
    private accountService: AccountService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  loading = false;
  saving = false;
  message = '';
  error = '';

  profile: ProfileData | null = null;

  editingField: 'name' | 'email' | 'phone' | 'password' | null = null;

  // temporary editing values
  editFirstName = '';
  editLastName = '';
  editEmail = '';
  editPhone = '';
  editPassword = '';
  editPasswordConfirm = '';


  ngOnInit() {
    const stored = localStorage.getItem('user');
    if (!stored) {
      this.router.navigate(['/login']);
      return;
    }

    let user: any;
    try {
      user = JSON.parse(stored);
    } catch {
      this.router.navigate(['/login']);
      return;
    }

    const customerId = user.customer_id ?? user.customerId;
    if (!customerId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile(customerId);
  }

  private loadProfile(customerId: number) {
    this.loading = true;
    this.accountService.getProfile(customerId).subscribe({
      next: (res) => {
        this.profile = res.user;
        this.resetEditValues();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.error = err?.error?.message || 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  startEdit(field: 'name' | 'email' | 'phone' | 'password') {
    this.editingField = field;
    this.resetEditValues();
  }

  cancelEdit() {
    this.editingField = null;
    this.resetEditValues();
    this.message = '';
    this.error = '';
  }

  saveChanges() {
    if (!this.profile) return;

    const customerId = this.profile.customer_id;
    const payload: UpdateProfilePayload = {};

    if (this.editingField === 'name') {
      payload.first_name = this.editFirstName.trim();
      payload.last_name = this.editLastName.trim();
    }

    if (this.editingField === 'email') {
      payload.email = this.editEmail.trim();
    }

    if (this.editingField === 'phone') {
      payload.phone = this.editPhone.trim();
    }

    if (this.editingField === 'password') {
      if (!this.editPassword || !this.editPasswordConfirm) {
        this.error = 'กรุณากรอกข้อมูลรหัสผ่านให้ครบ';
        return;
      }
      if (this.editPassword !== this.editPasswordConfirm) {
        this.error = 'รหัสผ่านไม่ตรงกัน';
        return;
      }
      payload.password = this.editPassword;
    }

    if (Object.keys(payload).length === 0) {
      this.error = 'ไม่มีข้อมูลให้บันทึก';
      return;
    }

    this.saving = true;
    this.error = '';
    this.message = '';

    this.accountService.updateProfile(customerId, payload).subscribe({
      next: (res) => {
        this.profile = res.user;
        localStorage.setItem('user', JSON.stringify(res.user));
        this.accountService.notifyProfileUpdate(res.user);
        this.message = res.message ?? 'อัปเดตข้อมูลสำเร็จ';
        this.editingField = null;
        this.resetEditValues();
        this.saving = false;

        // ล่าสุดจากเซิร์ฟเวอร์เพื่อให้หน้าดาต้า sync เสมอ
        this.loadProfile(customerId);
      },
      error: (err) => {
        console.error('Update failed', err);
        this.error = err?.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
        this.saving = false;
      },
    });
  }

  private resetEditValues() {
    if (!this.profile) return;

    this.editFirstName = this.profile.first_name;
    this.editLastName = this.profile.last_name;
    this.editEmail = this.profile.email;
    this.editPhone = this.profile.phone ?? '';
    this.editPassword = '';
    this.editPasswordConfirm = '';
  }
}
