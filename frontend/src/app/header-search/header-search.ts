// ===================== IMPORT MODULE =====================
// นำเข้า module / class ที่จำเป็น

import { Component, OnInit } from '@angular/core';
// Component = ใช้สร้าง component
// OnInit = lifecycle hook ทำงานตอน component โหลดครั้งแรก

import { CommonModule } from '@angular/common';
// ใช้คำสั่งพื้นฐาน เช่น *ngIf, *ngFor

import { ActivatedRoute } from '@angular/router';
// ใช้ดึงค่าจาก URL (เช่น query string ?q=keyword)

import { HttpClient, HttpClientModule } from '@angular/common/http';
// HttpClient = ใช้เรียก API
// HttpClientModule = module ที่ต้อง import เพื่อให้ใช้ HttpClient ได้


// ===================== COMPONENT DECORATOR =====================
@Component({
  selector: 'app-header-search', // ชื่อ component ใช้ใน HTML
  standalone: true, // เป็น standalone component
  imports: [CommonModule, HttpClientModule], 
  // module ที่ component นี้ใช้

  templateUrl: './header-search.html', // ไฟล์ HTML
  styleUrls: ['./header-search.css']   // ไฟล์ CSS
})


// ===================== CLASS COMPONENT =====================
export class HeaderSearchComponent implements OnInit {

  // ===================== VARIABLE =====================

  query: string = ''; 
  // เก็บคำค้นหาที่มาจาก URL เช่น ?q=ข้าว

  products: any[] = []; 
  // เก็บข้อมูลสินค้าที่ได้จาก API (array)

  loading: boolean = false; 
  // ใช้เช็คสถานะกำลังโหลดข้อมูล (true = กำลังโหลด)


  // ===================== CONSTRUCTOR =====================
  constructor(
    private route: ActivatedRoute, 
    // ใช้ดึงค่าจาก URL

    private http: HttpClient
    // ใช้เรียก API
  ) {}


  // ===================== LIFECYCLE: ngOnInit =====================
  ngOnInit(): void {

    // subscribe = เฝ้าดูการเปลี่ยนแปลงของ query params
    this.route.queryParams.subscribe(params => {

      // ดึงค่าจาก URL เช่น ?q=apple
      this.query = params['q'] || ''; 
      // ถ้าไม่มีค่า → ให้เป็น string ว่าง

      // ถ้ามีคำค้นหา → เรียกฟังก์ชันค้นหา
      if (this.query) {
        this.searchProducts();
      }

    });

  }


  // ===================== SEARCH FUNCTION =====================
  searchProducts() {

    this.loading = true; 
    // เริ่มโหลด → แสดง "กำลังค้นหา..."

    // เรียก API backend
    this.http.get<any[]>(
      `http://localhost:3000/api/products/search?q=${this.query}`
    )
    .subscribe({

      // ===================== SUCCESS =====================
      next: (data) => {

        this.products = data; 
        // เก็บข้อมูลสินค้าที่ได้จาก API

        this.loading = false; 
        // โหลดเสร็จแล้ว

      },

      // ===================== ERROR =====================
      error: (err) => {

        console.error("Search error:", err); 
        // แสดง error ใน console

        this.loading = false; 
        // หยุด loading แม้เกิด error

      }

    });

  }

}