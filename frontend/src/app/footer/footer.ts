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
      title: 'บัญชีของฉัน',
      links: [
        { label: 'บัญชีของฉัน',    href: '/order'  },
        { label: 'ประวัติการสั่งซื้อ', href: '/orders'   },
        { label: 'ตะกร้าสินค้า',  href: '/cart'     },
        { label: 'รายการโปรด',      href: '/wishlist' },
      ],
    },
    {
      title: 'ช่วยเหลือ',
      links: [
        { label: 'ติดต่อ',           href: '/contact' },
        { label: 'คำถามที่พบบ่อย',              href: '/faqs'    },
        { label: 'ข้อกำหนดและเงื่อนไข', href: '/terms'   },
        { label: 'นโยบายความเป็นส่วนตัว',    href: '/privacy' },
      ],
    },
    {
      title: 'หมวดหมู่',
      links: [
        { label: 'เกี่ยวกับเรา',       href: '/about'   },
        { label: 'ร้านค้า',        href: '/shop'    },
        { label: 'สินค้า',     href: '/product' },
        { label: 'ติดตามคำสั่งซื้อ', href: '/track'   },
      ],
    },
 
  ];

  paymentMethods: string[] = [ 'VISA', 'PromptPay', 'MasterCard'];

  socialLinks = [
    { name: 'Facebook',  href: '#', icon: 'facebook'  },
    { name: 'Twitter',   href: '#', icon: 'twitter'   },
    { name: 'Pinterest', href: '#', icon: 'pinterest' },
    { name: 'Instagram', href: '#', icon: 'instagram' },
  ];
}