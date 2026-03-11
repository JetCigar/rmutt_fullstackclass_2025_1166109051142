import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Category } from './category/category';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { CartComponent } from './cart/cart';  

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Category, CommonModule,HttpClientModule, CartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
