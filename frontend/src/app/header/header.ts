import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  searchQuery: string = '';
  selectedLang: string = 'TH';
  selectedCurrency: string = 'THB';
  isLoggedIn = false;
  username = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.checkLogin();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLogin();
      });

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'th',
          includedLanguages: 'th,en',
          autoDisplay: false
        },
        'google_translate_element'
      );
      const browserLang = navigator.language || 'th';
      if (browserLang.startsWith('en')) {
        setTimeout(() => {
          const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (select) {
            select.value = 'en';
            select.dispatchEvent(new Event('change'));
            this.selectedLang = 'EN';
          }
        }, 1200);
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }

  checkLogin() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.username = user.name || user.email || 'User';
    } else {
      this.username = '';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.username = '';
    this.router.navigate(['/login']);
  }

  switchLanguage(): void {
    const lang = this.selectedLang === 'TH' ? 'en' : 'th';
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
    if (lang === 'th') {
      setTimeout(() => {
        location.reload();
      }, 500);
    }
    this.selectedLang = this.selectedLang === 'TH' ? 'EN' : 'TH';
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/search'], {
      queryParams: { q: this.searchQuery }
    });
  }

  onWishlistClick(): void {
    this.router.navigate(['/order']);
  }

  onCartClick(): void {
    this.router.navigate(['/cart']);
  }

  get cartTotalFormatted(): string {
    return `฿${this.cartService.cartTotal().toLocaleString()}`;
  }
}