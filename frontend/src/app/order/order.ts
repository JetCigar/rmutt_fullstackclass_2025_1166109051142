import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSidebar } from '../account-sidebar/account-sidebar';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, AccountSidebar],
  templateUrl: './order.html',
  styleUrls: ['./order.css'],
})
export class Order {
  readonly orders = [
    {
      id: 'ORD-2026-0001',
      date: '2026-02-24',
      status: 'รอชำระเงิน',
      items: [
        { name: 'เกลือหิมาลัยหยาบ 4 กิโล', qty: 1, price: 4500 },
        { name: 'ไข่ไก่สดบรรจุ 12 ฟอง (พิเศษ)', qty: 1, price: 150 },
      ],
    },
    {
      id: 'ORD-2026-0002',
      date: '2026-02-24',
      status: 'สำเร็จ',
      items: [
        { name: 'ปั๊มน้ำขนาด 1.5HP', qty: 1, price: 3200 },
        { name: 'ท่อ PE ขนาด 20mm ยาว 10m', qty: 1, price: 800 },
      ],
    },
  ];

  formatPrice(value: number) {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(value);
  }

  getTotal(order: any) {
    return order.items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
  }
}
