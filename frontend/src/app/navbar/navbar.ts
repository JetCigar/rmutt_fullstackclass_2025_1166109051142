import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  href: string;
  hasDropdown: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  navItems: NavItem[] = [
    { label: 'Home',       href: '/',        hasDropdown: true  },
    { label: 'Shop',       href: '/shop',    hasDropdown: true  },
    { label: 'Pages',      href: '/pages',   hasDropdown: true  },
    { label: 'Blog',       href: '/blog',    hasDropdown: true  },
    { label: 'About Us',   href: '/about',   hasDropdown: false },
    { label: 'Contact Us', href: '/contact', hasDropdown: false },
  ];
}