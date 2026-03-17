// ===================== IMPORT =====================

// นำเข้า Component จาก Angular core
// ใช้สำหรับสร้าง component (ส่วนประกอบของหน้าเว็บ)
import { Component } from '@angular/core';

// นำเข้า CommonModule
// ใช้สำหรับ directive พื้นฐาน เช่น *ngIf, *ngFor
import { CommonModule } from '@angular/common';



// ===================== COMPONENT DECORATOR =====================

@Component({
  // selector คือชื่อ tag ที่ใช้เรียก component นี้ใน HTML
  // เช่น <app-about></app-about>
  selector: 'app-about',

  // standalone: true หมายถึง component นี้สามารถทำงานได้โดยไม่ต้องอยู่ใน NgModule
  // เป็นรูปแบบใหม่ของ Angular (Standalone Component)
  standalone: true,

  // imports คือ module ที่ component นี้ต้องใช้
  // ในที่นี้ใช้ CommonModule เพื่อใช้ directive พื้นฐาน
  imports: [CommonModule],

  // templateUrl คือไฟล์ HTML ที่ใช้แสดงผล UI
  templateUrl: './about.html',

  // styleUrl คือไฟล์ CSS สำหรับตกแต่ง component นี้
  styleUrl: './about.css'
})



// ===================== CLASS COMPONENT =====================

// สร้าง class ของ component
// ชื่อนี้จะใช้เป็นตัวควบคุม logic ของหน้า About
export class AboutComponent {

  // ตอนนี้ยังไม่มี logic ใด ๆ
  // ถ้าต้องการเพิ่ม เช่น ตัวแปร ฟังก์ชัน API สามารถเขียนเพิ่มในนี้ได้

}