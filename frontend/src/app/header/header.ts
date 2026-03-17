// ===================== IMPORT MODULE =====================
// นำเข้า (import) class และ module ที่จำเป็นสำหรับ component นี้

import { Component, OnInit } from '@angular/core'; 
// Component = ใช้สร้าง Angular Component
// OnInit = lifecycle hook ใช้ทำงานตอน component ถูกโหลดครั้งแรก

import { CommonModule } from '@angular/common'; 
// ใช้สำหรับคำสั่งพื้นฐาน เช่น *ngIf, *ngFor

import { FormsModule } from '@angular/forms'; 
// ใช้สำหรับ ngModel (two-way binding) ใน input

import { RouterModule, Router, NavigationEnd } from '@angular/router';
// RouterModule = ใช้กับ routerLink ใน HTML
// Router = ใช้สั่งเปลี่ยนหน้า
// NavigationEnd = event ที่เกิดเมื่อเปลี่ยนหน้าเสร็จ

import { CartService } from '../../services/cart.service';
// service สำหรับจัดการตะกร้าสินค้า

import { HttpClient } from '@angular/common/http';
// ใช้เรียก API (แม้ในโค้ดนี้ยังไม่ได้ใช้จริง)

import { filter } from 'rxjs/operators';
// ใช้กรอง event (ในที่นี้ใช้กับ router events)


// ===================== DECLARE GLOBAL =====================
// ใช้ประกาศตัวแปร global บน window เพื่อให้ TypeScript ไม่ error

declare global {
  interface Window {
    google: any; // ใช้สำหรับ Google Translate
    googleTranslateElementInit: any; // function init translate
  }
}


// ===================== COMPONENT DECORATOR =====================
@Component({
  selector: 'app-header', // ชื่อ tag ที่ใช้ใน HTML <app-header>
  standalone: true, // เป็น standalone component (ไม่ต้องใช้ module)
  imports: [CommonModule, FormsModule, RouterModule], 
  // module ที่ component นี้ใช้งาน

  templateUrl: './header.html', // ไฟล์ HTML
  styleUrls: ['./header.css']   // ไฟล์ CSS
})


// ===================== CLASS COMPONENT =====================
export class HeaderComponent implements OnInit {

  // ===================== VARIABLE =====================

  searchQuery: string = ''; 
  // เก็บค่าที่ผู้ใช้พิมพ์ในช่องค้นหา

  selectedLang: string = 'TH'; 
  // ภาษาที่เลือก (ค่าเริ่มต้น = ไทย)

  selectedCurrency: string = 'THB'; 
  // สกุลเงิน (ค่าเริ่มต้น = บาท)

  isLoggedIn = false; 
  // เช็คสถานะ login (true = login แล้ว)

  username = ''; 
  // เก็บชื่อผู้ใช้


  // ===================== CONSTRUCTOR =====================
  constructor(
    private router: Router, // ใช้เปลี่ยนหน้า
    private http: HttpClient, // ใช้เรียก API
    public cartService: CartService // ใช้ข้อมูลตะกร้า
  ) {}


  // ===================== LIFECYCLE: ngOnInit =====================
  ngOnInit(): void {

    // ⭐ เช็ค login ตอนโหลดหน้า
    this.checkLogin();

    // ⭐ เช็ค login ทุกครั้งที่เปลี่ยนหน้า
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      // filter = กรองเฉพาะ event NavigationEnd
      .subscribe(() => {
        this.checkLogin(); // เรียกใหม่ทุกครั้งที่เปลี่ยนหน้า
      });


    // ================= GOOGLE TRANSLATE =================

    // function สำหรับ init Google Translate
    window.googleTranslateElementInit = () => {

      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'th', // ภาษาหลักของเว็บ
          includedLanguages: 'th,en', // ภาษาที่รองรับ
          autoDisplay: false // ไม่โชว์ popup อัตโนมัติ
        },
        'google_translate_element' // id ใน HTML
      );

      // ตรวจสอบภาษาของ browser
      const browserLang = navigator.language || 'th';

      // ถ้า browser เป็นภาษาอังกฤษ
      if (browserLang.startsWith('en')) {

        setTimeout(() => {

          const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;

          if (select) {
            select.value = 'en'; // เปลี่ยนเป็นอังกฤษ
            select.dispatchEvent(new Event('change')); // trigger change
            this.selectedLang = 'EN'; // update UI
          }

        }, 1200); // delay เพื่อรอโหลด DOM

      }

    };

    // โหลด script Google Translate ถ้ายังไม่มี
    if (!document.getElementById('google-translate-script')) {

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;

      document.body.appendChild(script);

    }

  }


  // ===================== CHECK LOGIN =====================
  checkLogin() {

    const token = localStorage.getItem('token'); 
    // ดึง token จาก localStorage

    this.isLoggedIn = !!token; 
    // ถ้ามี token = true, ไม่มี = false

    const userData = localStorage.getItem('user'); 
    // ดึงข้อมูล user

    if (userData) {
      const user = JSON.parse(userData); 
      // แปลง string → object

      this.username = user.name || user.email || 'User'; 
      // แสดงชื่อ (ถ้าไม่มีใช้ email หรือ default)
    } else {
      this.username = '';
    }

  }


  // ===================== LOGOUT =====================
  logout() {

    localStorage.removeItem('token'); 
    localStorage.removeItem('user'); 
    // ลบข้อมูล login

    this.isLoggedIn = false; 
    this.username = '';

    this.router.navigate(['/login']); 
    // ไปหน้า login

  }


  // ===================== SWITCH LANGUAGE =====================
  switchLanguage(): void {

    const lang = this.selectedLang === 'TH' ? 'en' : 'th'; 
    // สลับภาษา TH ↔ EN

    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;

    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change')); 
      // trigger ให้ Google Translate เปลี่ยนภาษา
    }

    // ถ้าเปลี่ยนกลับเป็นไทย → reload หน้า
    if (lang === 'th') {
      setTimeout(() => {
        location.reload();
      }, 500);
    }

    // อัปเดตค่า UI
    this.selectedLang = this.selectedLang === 'TH' ? 'EN' : 'TH';

  }


  // ===================== SEARCH =====================
  onSearch(): void {

    if (!this.searchQuery.trim()) return; 
    // ถ้า input ว่าง → ไม่ทำอะไร

    this.router.navigate(['/search'], {
      queryParams: { q: this.searchQuery }
      // ส่งค่า search ไปหน้า /search?q=...
    });

  }


  // ===================== WISHLIST =====================
  onWishlistClick(): void {
    console.log('[Header] Wishlist clicked');
    // ตอนนี้ยังไม่ได้ทำ logic จริง
  }


  // ===================== CART =====================
  onCartClick(): void {

    console.log('[Header] Cart clicked');

    this.router.navigate(['/cart']); 
    // ไปหน้าตะกร้า

  }


  // ===================== CART TOTAL =====================
  get cartTotalFormatted(): string {
    return `฿${this.cartService.cartTotal().toLocaleString()}`;
    // ดึงยอดรวมจาก cartService แล้ว format เป็นเงิน
  }

}