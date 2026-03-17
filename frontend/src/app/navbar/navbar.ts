// ===================== IMPORT MODULE =====================
// นำเข้า class / module ที่จำเป็นสำหรับ component นี้

import { Component, OnInit } from '@angular/core';
// Component = ใช้สร้าง component
// OnInit = lifecycle hook (ทำงานตอน component โหลดครั้งแรก)

import { CommonModule } from '@angular/common';
// ใช้คำสั่งพื้นฐาน เช่น *ngIf, *ngFor

import { RouterModule, Router, NavigationEnd } from '@angular/router';
// RouterModule = ใช้กับ routerLink ใน HTML
// Router = ใช้เปลี่ยนหน้า
// NavigationEnd = event เมื่อเปลี่ยนหน้าเสร็จ

import { filter } from 'rxjs/operators';
// ใช้กรอง event (เลือกเฉพาะ NavigationEnd)


// ===================== INTERFACE =====================
// ใช้กำหนดรูปแบบข้อมูลของเมนู

interface NavItem {
  label: string;       // ชื่อเมนู
  href: string;        // path เช่น /home
  hasDropdown: boolean; // มี dropdown หรือไม่
}


// ===================== COMPONENT DECORATOR =====================
@Component({
  selector: 'app-navbar', // ชื่อ component ใช้ใน HTML
  standalone: true,       // เป็น standalone component

  imports: [CommonModule, RouterModule], 
  // module ที่ component นี้ใช้

  templateUrl: './navbar.html', // ไฟล์ HTML
  styleUrls: ['./navbar.css']   // ไฟล์ CSS
})


// ===================== CLASS COMPONENT =====================
export class NavbarComponent implements OnInit {

  // ===================== MENU DATA =====================

  navItems: NavItem[] = [
    { label: 'หน้าแรก', href: '/home', hasDropdown: false },
    { label: 'สินค้า', href: '/category', hasDropdown: false },
    { label: 'โปรโมชั่น', href: '/promotion', hasDropdown: false },
    { label: 'เกี่ยวกับเรา', href: '/about', hasDropdown: false },
    { label: 'ติดต่อเรา', href: '/contact', hasDropdown: false },
  ];
  // array เก็บรายการเมนูทั้งหมด


  // ===================== BREADCRUMB =====================

  breadcrumbs: string[] = [];
  // เก็บ path ปัจจุบัน เช่น ["สินค้า"]


  // ===================== LOGIN =====================

  isLoggedIn = false;
  // เช็คสถานะ login

  username: string = '';
  // เก็บชื่อผู้ใช้


  // ===================== MAP PATH → LABEL =====================

  breadcrumbMap: any = {
    '/login': 'เข้าสู่ระบบ',
    '/register': 'สมัครสมาชิก',
    '/category': 'สินค้าทั้งหมด',
    '/promotion': 'โปรโมชั่น',
    '/about': 'เกี่ยวกับเรา',
    '/contact': 'ติดต่อเรา'
  };
  // ใช้แปลง path เป็นข้อความไทย


  // ===================== CONSTRUCTOR =====================
  constructor(private router: Router) {}
  // inject Router เพื่อใช้เปลี่ยนหน้าและดู URL


  // ===================== LIFECYCLE =====================
  ngOnInit(): void {

    this.checkLogin(); 
    // เช็ค login ตอนโหลดครั้งแรก

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      // กรองเฉพาะ event ที่เปลี่ยนหน้าเสร็จ

      .subscribe(() => {

        this.checkLogin(); 
        // เช็ค login ทุกครั้งที่เปลี่ยนหน้า

        const url = this.router.url.split('?')[0];
        // เอา URL ปัจจุบัน (ตัด query เช่น ?q=...)

        const path = '/' + url.split('/')[1];
        // เอาเฉพาะ path หลัก เช่น /category

        const label = this.breadcrumbMap[path];
        // เอา label ภาษาไทยจาก map

        this.breadcrumbs = [];
        // reset breadcrumb ทุกครั้ง

        if (url !== '/' && label) {
          this.breadcrumbs.push(label);
          // ถ้าไม่ใช่หน้าแรก → ใส่ breadcrumb
        }

      });

  }


  // ===================== CHECK LOGIN =====================
  checkLogin() {

    const token = localStorage.getItem('token');
    // ดึง token จาก localStorage

    this.isLoggedIn = !!token;
    // ถ้ามี token = true

    const userData = localStorage.getItem('user');
    // ดึงข้อมูล user

    if (userData) {

      const user = JSON.parse(userData);
      // แปลง string → object

      this.username = user.name || user.email || 'User';
      // ใช้ name ถ้าไม่มีใช้ email ถ้ายังไม่มีใช้ 'User'

    }

  }


  // ===================== LOGOUT =====================
  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // ลบข้อมูล login

    this.isLoggedIn = false;
    this.username = '';
    // reset ค่า

    this.router.navigate(['/login']);
    // ไปหน้า login

  }

}