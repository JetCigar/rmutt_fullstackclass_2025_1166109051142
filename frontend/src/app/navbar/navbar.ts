import { Component } from '@angular/core';
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
export class NavbarComponent {

  navItems: NavItem[] = [
   
    { label: 'หน้าแรก', href: '/', hasDropdown: false },/*Home */
    { label: 'สินค้า', href: '/category', hasDropdown: false },
    { label: 'โปรโมชั่น', href: '/promotion', hasDropdown: false },
    { label: 'เกี่ยวกับเรา', href: '/about', hasDropdown: false },
    { label: 'ติดต่อเรา', href: '/footer', hasDropdown: false },
  ];

  breadcrumbs: string[] = [];

  // ⭐ map route -> ภาษาไทย
  breadcrumbMap: any = {
    '/login': 'เข้าสู่ระบบ',
    '/register': 'สมัครสมาชิก',
    '/': 'หน้าแรก',/*Home */
    '/category': 'สินค้าทั้งหมด',
    '/promotion': 'โปรโมชั่น',
    '/about': 'เกี่ยวกับเรา',
    '/footer': 'ติดต่อเรา'
  };

  constructor(private router: Router) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

const url = this.router.url.split('?')[0];

const path = '/' + url.split('/')[1];

const label = this.breadcrumbMap[path];

        this.breadcrumbs = [];

        if (url !== '/' && label) {
          this.breadcrumbs.push(label);
        }

      });

  }

}