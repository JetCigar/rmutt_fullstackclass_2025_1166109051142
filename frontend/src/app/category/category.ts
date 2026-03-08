import { Component, OnInit } from '@angular/core';
import { CategoryService ,CategoryData} from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core'; // เพิ่มอันนี้


@Component({
  selector: 'app-category',
  imports: [CommonModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  categories: any[] = [];

  constructor(private categoryService: CategoryService,
   private cdr: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((res :any) => {
      this.categories = res.categories;

      console.log(this.categories);
      console.log('ข้อมูลจาก API:', res);
      console.log("ชื่อสินค้าตัวแรก:", this.categories[0].products[0].name);
      console.log("ชื่อสินค้าตัวแรก:", this.categories[0].products[1].name);
      console.log("ชื่อสินค้าตัวแรก:", this.categories[0].products[2].name);
      // สั่งให้ Angular ตรวจสอบการเปลี่ยนแปลงและวาดหน้าจอใหม่ทันที
      this.cdr.detectChanges();
    });
  }
}


