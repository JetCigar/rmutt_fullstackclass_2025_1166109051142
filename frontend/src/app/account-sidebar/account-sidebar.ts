import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AccountService } from '../services/account.service';

interface AccountMenuItem {
  label: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './account-sidebar.html',
  styleUrls: ['./account-sidebar.css'],
})
export class AccountSidebar implements OnInit, OnDestroy {
  profile = {
    initial: 'ส',
    name: 'ผู้ใช้งาน',
    email: '',
  };

  readonly menuItems: AccountMenuItem[] = [
    { label: 'คำสั่งซื้อ', icon: 'bi-cart-check', route: '/order' },
    { label: 'รีวิว', icon: 'bi-star', route: '/review' },
    { label: 'การจัดส่ง', icon: 'bi-truck', route: '/shipping' },
    { label: 'ที่อยู่', icon: 'bi-geo-alt', route: '/address' },
    { label: 'ตั้งค่าบัญชี', icon: 'bi-gear', route: '/settings' },
  ];

  readonly logoutItem: AccountMenuItem = {
    label: 'ออกจากระบบ',
    icon: 'bi-box-arrow-right',
  };

  private profileSub?: Subscription;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProfileFromStorage();

    this.profileSub = this.accountService.profileUpdated$.subscribe((newProfile) => {
      const name = `${newProfile.first_name ?? ''} ${newProfile.last_name ?? ''}`.trim();
      this.profile = {
        initial: name ? name[0] : 'ส',
        name: name || this.profile.name,
        email: newProfile.email ?? this.profile.email,
      };
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.profileSub?.unsubscribe();
  }

  private loadProfileFromStorage() {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const name = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
        this.profile = {
          initial: name ? name[0] : 'ส',
          name: name || this.profile.name,
          email: user.email ?? this.profile.email,
        };
      } catch {
        // ignore
      }
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
