import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {

  cartCount: number = 2;
  cartTotal: number = 57.00;
  searchQuery: string = '';

  // ✅ เพิ่มตัวแปรที่หายไป
  selectedLang: string = 'Eng';
  selectedCurrency: string = 'USD';

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
    console.log('[Header] Wishlist clicked');
  }

  onCartClick(): void {
    console.log('[Header] Cart clicked');
  }

  get cartTotalFormatted(): string {
    return `$${this.cartTotal.toFixed(2)}`;
  }
}