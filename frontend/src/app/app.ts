import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Category } from './category/category';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './cart/cart';
import { HeaderComponent } from './header/header';
import { NavbarComponent } from './navbar/navbar';
import { FooterComponent } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Category,
    CommonModule,
    HttpClientModule,
    CartComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}