import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  footerSections: FooterSection[] = [
    {
      title: 'My Account',
      links: [
        { label: 'My Account',    href: '/account'  },
        { label: 'Order History', href: '/orders'   },
        { label: 'Shoping Cart',  href: '/cart'     },
        { label: 'Wishlist',      href: '/wishlist' },
      ],
    },
    {
      title: 'Helps',
      links: [
        { label: 'Contact',           href: '/contact' },
        { label: 'Faqs',              href: '/faqs'    },
        { label: 'Terms & Condition', href: '/terms'   },
        { label: 'Privacy Policy',    href: '/privacy' },
      ],
    },
    {
      title: 'Proxy',
      links: [
        { label: 'About',       href: '/about'   },
        { label: 'Shop',        href: '/shop'    },
        { label: 'Product',     href: '/product' },
        { label: 'Track Order', href: '/track'   },
      ],
    },
    {
      title: 'Categories',
      links: [
        { label: 'Fruit & Vegetables', href: '/category/fruit-vegetables' },
        { label: 'Meat & Fish',        href: '/category/meat-fish'        },
        { label: 'Bread & Bakery',     href: '/category/bread-bakery'     },
        { label: 'Beauty & Health',    href: '/category/beauty-health'    },
      ],
    },
  ];

  paymentMethods: string[] = ['Apple Pay', 'VISA', 'Discover', 'Mastercard'];

  socialLinks = [
    { name: 'Facebook',  href: '#', icon: 'facebook'  },
    { name: 'Twitter',   href: '#', icon: 'twitter'   },
    { name: 'Pinterest', href: '#', icon: 'pinterest' },
    { name: 'Instagram', href: '#', icon: 'instagram' },
  ];
}