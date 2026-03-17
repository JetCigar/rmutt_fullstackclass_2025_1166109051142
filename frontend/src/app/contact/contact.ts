// ===================== IMPORT =====================

// นำเข้า Component จาก Angular core
// ใช้สำหรับสร้าง component ของ Angular
import { Component } from '@angular/core';

// นำเข้า CommonModule
// ใช้สำหรับ directive พื้นฐาน เช่น *ngIf, *ngFor
import { CommonModule } from '@angular/common';



// ===================== COMPONENT DECORATOR =====================

@Component({
  // selector คือชื่อ tag ที่ใช้เรียกใช้งาน component นี้ใน HTML
  // เช่น <app-contact></app-contact>
  selector: 'app-contact',

  // standalone: true หมายถึง component นี้สามารถใช้งานได้โดยไม่ต้องอยู่ใน NgModule
  // เป็นรูปแบบใหม่ของ Angular (Standalone Component)
  standalone: true,

  // imports คือ module ที่ component นี้ต้องใช้
  // ในที่นี้ใช้ CommonModule สำหรับคำสั่งพื้นฐานใน template
  imports: [CommonModule],

  // templateUrl คือไฟล์ HTML ที่ใช้แสดงหน้า Contact
  templateUrl: './contact.html',

  // styleUrl คือไฟล์ CSS สำหรับตกแต่งหน้า Contact
  styleUrl: './contact.css'
})



// ===================== CLASS COMPONENT =====================

// สร้าง class ของ component
// ใช้สำหรับควบคุม logic ของหน้า Contact
export class ContactComponent {

  // ตอนนี้ยังไม่มี logic ภายใน
  // สามารถเพิ่มตัวแปร เช่น email, phone
  // หรือฟังก์ชัน เช่น ส่งข้อมูล / เรียก API ได้ในอนาคต

}