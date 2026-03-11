import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  constructor(private router: Router) {}

  cartCount: number = 0;
  cartTotal: number = 0;
  searchQuery: string = '';


selectedLang: string = 'TH';
selectedCurrency: string = 'THB';
toggleLang() {
  this.selectedLang = this.selectedLang === 'TH' ? 'EN' : 'TH';
}

toggleCurrency() {
  this.selectedCurrency = this.selectedCurrency === 'USD' ? 'THB' : 'USD';
}
  changeLang(lang: string) {
    this.selectedLang = lang;
    console.log('Language:', lang);
  }

  changeCurrency(cur: string) {
    this.selectedCurrency = cur;
    console.log('Currency:', cur);
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    console.log('[Header] Search:', this.searchQuery);
    // this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
  }

  onWishlistClick(): void {
    this.router.navigate(['/order']);
  }

  onCartClick(): void {
    console.log('[Header] Cart clicked');
  }

  get cartTotalFormatted(): string {
    return `$${this.cartTotal.toFixed(2)}`;
  }
}