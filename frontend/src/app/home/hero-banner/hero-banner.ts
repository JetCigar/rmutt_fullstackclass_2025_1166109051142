import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './hero-banner.html',
  styleUrls: ['../home.css'],
})
export class HeroBannerComponent {}
