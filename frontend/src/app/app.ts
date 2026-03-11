import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Category } from './category/category';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { HeaderComponent } from './header/header';
import { NavbarComponent } from './navbar/navbar';
import { FooterComponent } from './footer/footer';
import { CartComponent } from './cart/cart';  

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Category,
    CommonModule,
    HttpClientModule,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    CartComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}