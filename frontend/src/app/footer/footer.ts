// ===================== IMPORT =====================

// นำเข้า Component สำหรับสร้าง component
import { Component } from '@angular/core';

// นำเข้า CommonModule สำหรับใช้ directive เช่น *ngIf, *ngFor
import { CommonModule } from '@angular/common';



// ===================== INTERFACE =====================

// interface สำหรับ link ใน footer (แต่ละลิงก์)
interface FooterLink {
  label: string; // ชื่อที่แสดง เช่น "บัญชีของฉัน"
  href: string;  // path ของลิงก์ เช่น "/account"
}

// interface สำหรับ section (แต่ละคอลัมน์)
interface FooterSection {
  title: string;        // ชื่อหัวข้อ เช่น "ช่วยเหลือ"
  links: FooterLink[];  // array ของลิงก์ใน section นั้น
}



// ===================== COMPONENT DECORATOR =====================

@Component({
  selector: 'app-footer',   // ชื่อ tag ที่ใช้เรียก component (<app-footer>)
  standalone: true,         // เป็น standalone component (ไม่ต้องใช้ NgModule)
  imports: [CommonModule],  // import module ที่ใช้ใน template
  templateUrl: './footer.html', // ไฟล์ HTML
  styleUrls: ['./footer.css']   // ไฟล์ CSS
})



// ===================== CLASS COMPONENT =====================

export class FooterComponent {

  // ===================== YEAR =====================

  // เก็บปีปัจจุบัน (ใช้แสดง copyright อัตโนมัติ)
  currentYear: number = new Date().getFullYear();



  // ===================== FOOTER SECTIONS =====================

  // ข้อมูลคอลัมน์เมนูใน footer
  footerSections: FooterSection[] = [

    {
      title: 'บัญชีของฉัน', // ชื่อคอลัมน์
      links: [
        { label: 'บัญชีของฉัน',    href: '/order'  },   // ลิงก์ไปหน้าบัญชี
        { label: 'ประวัติการสั่งซื้อ', href: '/orders'   },   // ลิงก์คำสั่งซื้อ
        { label: 'ตะกร้าสินค้า',  href: '/cart'     },   // ลิงก์ตะกร้า
        { label: 'รายการโปรด',      href: '/wishlist' },   // ลิงก์ wishlist
      ],
    },

    {
      title: 'ช่วยเหลือ',
      links: [
        { label: 'รีวิวจากลูกค้า',           href: '/review' },  // รีวิว
        { label: 'คำถามที่พบบ่อย',              href: '/faqs'    },  // FAQ
        { label: 'ข้อกำหนดและเงื่อนไข', href: '/terms'   },  // Terms
        { label: 'นโยบายความเป็นส่วนตัว',    href: '/privacy' },  // Privacy
      ],
    },

    {
      title: 'หมวดหมู่',
      links: [
        { label: 'เกี่ยวกับเรา',       href: '/about'   },  // About
        { label: 'ร้านค้า',        href: '/shop'    },  // Shop
        { label: 'สินค้า',     href: '/product' },  // Product
        { label: 'ติดตามคำสั่งซื้อ', href: '/track'   },  // Track
      ],
    },

  ];



  // ===================== PAYMENT METHODS =====================

  // รายการช่องทางการชำระเงิน
  paymentMethods: string[] = [
    'VISA',
    'PromptPay',
    'MasterCard'
  ];



  // ===================== SOCIAL LINKS =====================

  // ข้อมูล social media
  socialLinks = [
    { name: 'Facebook',  href: '#', icon: 'facebook'  }, // Facebook
    { name: 'Twitter',   href: '#', icon: 'twitter'   }, // Twitter
    { name: 'Pinterest', href: '#', icon: 'pinterest' }, // Pinterest
    { name: 'Instagram', href: '#', icon: 'instagram' }, // Instagram
  ];

}