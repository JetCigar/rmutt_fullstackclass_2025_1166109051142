import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule, RouterModule,],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  categories: any[] = [];
  allProducts: any[] = []; // เพิ่มตัวแปรสำหรับเก็บสินค้าทั้งหมดเพื่อแสดงฝั่งขวา
  filteredProducts: any[] = []; // ตัวแปรสำหรับเก็บสินค้าที่ถูกกรองตามหมวดหมู่ที่เลือกเอาไป for loop เพื่อ เเสดง 
  selectedCategoryIds: number[] = []; // ตัวแปรสำหรับเก็บหมวดหมู่ที่ถูกเลือก
  imageUrl: string[] = []; // URL image ของสินค้า
  currentPrice = 0;
  sortOrder: string = '';
  searchKeyword: string = ''; // ตัวแปรสำหรับคำค้นหา



  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,// เพิ่มตัวนี้
    private route: ActivatedRoute,
  ) { }


  // ใน category.ts
  viewProductDetail(product: any) {
    // ส่งไปที่ path 'product-info' พร้อมกับ ID
    this.router.navigate(['/product-info', product.product_id]);
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res.categories;

      // นำสินค้าจากทุกหมวดหมู่มารวมกัน (Flatten) ไว้ใน allProducts
      this.allProducts = this.categories.reduce((acc, category) => {
        if (category.products && category.products.length > 0) {
          return acc.concat(category.products);
        }
        return acc;
      }, []);

      // ตรวจสอบ query params จาก URL แบบ Subscribe ให้ทำงานทุกครั้งที่มีการเปลี่ยน URL เพื่อให้การค้นหาทำได้ต่อเนื่อง
      this.route.queryParams.subscribe(params => {
        const categoryIdFromRoute = params['id'];
        this.searchKeyword = params['q'] || ''; //ดึง keyword ค้นหาจาก url query string

        if (categoryIdFromRoute) {
          this.selectedCategoryIds = [Number(categoryIdFromRoute)];
        } else if (this.searchKeyword) {
           // กรณีมีการค้นหาจากหน้าอื่น จะรีเซ็ตหมวดหมู่เพื่อให้ค้นหาเจอทุกที่
          this.selectedCategoryIds = [];
        }

        this.applyFilter(); // กรองสินค้าใหม่ทุกครั้งที่มีการเปลี่ยน URL (เช่นค้นหาใหม่)

        console.log('หมวดหมู่:', this.categories);
        console.log('สินค้าทั้งหมด:', this.allProducts);
        
        this.cdr.detectChanges();
      });
    });
  }


  onCategoryChange(event: any, categoryId: number) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedCategoryIds.push(categoryId);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }

    // เรียก filter รวมจุดเดียว
    this.applyFilter();
  }

  clearFilter() {
    this.selectedCategoryIds = [];
    this.currentPrice = 0; // หรือค่า max ที่คุณต้องการ
    this.applyFilter(); // คืนค่ากลับเป็นสินค้าทั้งหมด
  }

  onSortChange(order: string) {
    this.sortOrder = order;
    this.applyFilter();
  }

  applyFilter() {
    // 1. เริ่มต้นจากสินค้าทั้งหมดก่อนเสมอ
    let tempProducts = [...this.allProducts];

    // กรองด้วยคำค้นหา (ถ้ามี)
    if (this.searchKeyword) {
      const keyword = this.searchKeyword.toLowerCase();
      tempProducts = tempProducts.filter(product =>
        product.name?.toLowerCase().includes(keyword) || 
        product.description?.toLowerCase().includes(keyword)
      );
    }

    // 2. กรองตามหมวดหมู่ (ถ้ามีการเลือก)
    if (this.selectedCategoryIds.length > 0) {
      tempProducts = tempProducts.filter(product =>
        // สมมติว่าใน product แต่ละตัวมี category_id เก็บไว้อยู่แล้ว
        this.selectedCategoryIds.includes(product.category_id)
      );
    }

    // 3. กรองตามราคา (ถ้า currentPrice > 0 หรือตามความเหมาะสม)
    if (this.currentPrice > 0) {
      tempProducts = tempProducts.filter(product =>
        Number(product.price) <= this.currentPrice
      );
    }

    //เรียงลำดับราคา (เพิ่มใหม่) 
    if (this.sortOrder === 'lowToHigh') {
      tempProducts.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (this.sortOrder === 'highToLow') {
      tempProducts.sort((a, b) => Number(b.price) - Number(a.price));
    }

    // 4. เอาผลลัพธ์สุดท้ายไปแสดงผล
    this.filteredProducts = tempProducts;
  }




}