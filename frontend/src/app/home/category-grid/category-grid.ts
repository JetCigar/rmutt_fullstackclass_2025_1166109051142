import { Component, Input, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryData } from '../../../services/category.service';

interface HomeCategory extends CategoryData {
  image?: string;
  product_count?: number;
}

@Component({
  selector: 'app-category-grid',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './category-grid.html',
  styleUrls: ['../home.css'],
})
export class CategoryGridComponent {
  @Input() categories!: Signal<HomeCategory[]>;
  @Input() isLoading!: Signal<boolean>;
}
