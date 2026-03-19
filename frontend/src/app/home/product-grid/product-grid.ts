import { Component, Input, Output, EventEmitter, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductData } from '../../../services/product.service';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './product-grid.html',
  styleUrls: ['../home.css'],
})
export class ProductGridComponent {
  @Input() products!: Signal<ProductData[]>;
  @Input() isLoading!: Signal<boolean>;
  @Output() addToCart = new EventEmitter<ProductData>();
}
