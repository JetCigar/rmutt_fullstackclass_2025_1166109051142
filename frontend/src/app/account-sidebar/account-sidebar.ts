import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AccountMenuItem {
  label: string;
  icon: string;
  active?: boolean;
}

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-sidebar.html',
  styleUrls: ['./account-sidebar.css'],
})
export class AccountSidebar {
  readonly profile = {
    initial: 'ส',
    name: 'สมชาย ใจสู้',
    email: 'somchai.j@email.com',
  };

  readonly menuItems: AccountMenuItem[] = [
    { label: 'คำสั่งซื้อ', icon: 'bi-cart-check', active: true },
    { label: 'รีวิว', icon: 'bi-star' },
    { label: 'การจัดส่ง', icon: 'bi-truck' },
    { label: 'ที่อยู่', icon: 'bi-geo-alt' },
    { label: 'ตั้งค่าบัญชี', icon: 'bi-gear' },
  ];

  readonly logoutItem: AccountMenuItem = {
    label: 'ออกจากระบบ',
    icon: 'bi-box-arrow-right',
  };
}
