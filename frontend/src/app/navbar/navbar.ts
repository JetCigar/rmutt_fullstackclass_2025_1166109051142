import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  href: string;
  hasDropdown: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  navItems: NavItem[] = [
    { label: 'หน้าแรก', href: '/home', hasDropdown: false },
    { label: 'สินค้า', href: '/category', hasDropdown: false },
    { label: 'โปรโมชั่น', href: '/promotion', hasDropdown: false },
    { label: 'เกี่ยวกับเรา', href: '/about', hasDropdown: false },
    { label: 'ติดต่อเรา', href: '/contact', hasDropdown: false },
  ];

  breadcrumbs: string[] = [];
  isLoggedIn = false;
  username: string = '';
  isMenuOpen = false;

  breadcrumbMap: any = {
    '/login': 'เข้าสู่ระบบ',
    '/register': 'สมัครสมาชิก',
    '/category': 'สินค้าทั้งหมด',
    '/promotion': 'โปรโมชั่น',
    '/about': 'เกี่ยวกับเรา',
    '/contact': 'ติดต่อเรา'
  };

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
    this.checkLogin();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLogin();
        this.isMenuOpen = false;

        const url = this.router.url.split('?')[0];
        const path = '/' + url.split('/')[1];
        const label = this.breadcrumbMap[path];

        this.breadcrumbs = [];
        if (url !== '/' && url !== '/home' && label) {
          this.breadcrumbs.push(label);
        }
      });
  }

  checkLogin() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.username = user.name || user.email || 'User';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.username = '';
    this.router.navigate(['/login']);
  }
}