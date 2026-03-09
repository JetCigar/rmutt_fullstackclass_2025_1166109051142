import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Category } from './category/category';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Category, CommonModule,HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
