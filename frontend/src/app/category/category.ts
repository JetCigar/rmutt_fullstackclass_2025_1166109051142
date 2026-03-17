import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  imports: [CommonModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  categories: any[] = [];
  allProducts: any[] = []; // เพิ่มตัวแปรสำหรับเก็บสินค้าทั้งหมดเพื่อแสดงฝั่งขวา
  filteredProducts: any[] = []; // ตัวแปรสำหรับเก็บสินค้าที่ถูกกรองตามหมวดหมู่ที่เลือกเอาไป for loop เพื่อ เเสดง 
  selectedCategoryIds: number[] = []; // ตัวแปรสำหรับเก็บหมวดหมู่ที่ถูกเลือก
  imageUrl: string [] = []; // URL image ของสินค้า




  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

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
      this.filteredProducts = [...this.allProducts]; // เริ่มต้นให้แสดงสินค้าทั้งหมดก่อน
      // ฟังก์ชันกรองสินค้าเพื่อแสดงผล
      console.log('หมวดหมู่:', this.categories);
      console.log('สินค้าทั้งหมด:', this.allProducts);
      console.log('รูปภาพ:', this.allProducts.map((p: any) => p.images[0]?.image_url));

      this.cdr.detectChanges();
    });
  }


  onCategoryChange(event: any, categoryId: number) {
    const isChecked = event.target.checked; // เช็คว่าเป็นการติ๊กถูก หรือเอาติ๊กออก

    if (isChecked) {
      // ถ้าติ๊กถูก ให้เอา ID ยัดใส่ Array
      this.selectedCategoryIds.push(categoryId);
    } else {
      // ถ้าเอาติ๊กออก ให้เตะ ID ออกจาก Array
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }

    // แล้วค่อยเรียกใช้ applyFilter เพื่อกรองสินค้า
    this.applyFilter();
  }

  
  applyFilter() {
    if (this.selectedCategoryIds.length === 0) {
      // กรณีที่ 1: ไม่ได้ติ๊กอะไรเลย -> ให้แสดงสินค้าทั้งหมด
      this.filteredProducts = [...this.allProducts];
    } else {
      // กรณีที่ 2: มีการติ๊กเลือกหมวดหมู่
      // ไปหาหมวดหมู่ที่ตรงกับ ID ที่เราเลือกไว้
      const selectedCategories = this.categories.filter(category =>
        this.selectedCategoryIds.includes(category.category_id)
      );

      // เอาสินค้าของหมวดหมู่ที่เลือกมาเทรวมกัน
      this.filteredProducts = selectedCategories.reduce((acc, category) => {
        if (category.products && category.products.length > 0) {
          return acc.concat(category.products);
        }
        return acc;
      }, []);
    }
  }

  clearFilter() {
    this.filteredProducts = [...this.allProducts]; // คืนค่าสินค้าทั้งหมดให้กลับมาแสดงเหมือนเดิม
    this.selectedCategoryIds = []; // เคลียร์การเลือกหมวดหมู่ทั้งหมด (ถ้ามีการใช้ตัวแปรนี้ใน HTML เพื่อเช็คสถานะการติ๊ก ก็จะทำให้ Checkbox กลับมาเป็นไม่ติ๊กทั้งหมดด้วย)
  }
}