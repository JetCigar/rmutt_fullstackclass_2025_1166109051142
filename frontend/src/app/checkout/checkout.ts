import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../services/order.service';
import { AddressService, AddressData } from '../services/address.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class CheckoutComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  step = 1; // 1=ที่อยู่, 2=ชำระเงิน, 3=ยืนยัน

  // Address
  savedAddresses: AddressData[] = [];
  selectedAddressId: number | 'new' = 'new';
  address = {
    name: '',
    phone: '',
    street: '',
    province: '',
    zip: '',
    firstName: '',
    lastName: ''
  };

  // Payment
  paymentMethod: 'card' | 'qr' | 'transfer' | 'cod' = 'card';
  card = { number: '', expiry: '', cvv: '', holder: '' };
  slipFile: File | null = null;
  slipFileName = '';

  // Order result
  orderId = '';
  orderSuccess = false;

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private addressService: AddressService,
    private router: Router
  ) {}

  ngOnInit() {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const nameParts = user.full_name ? user.full_name.split(' ') : [];
        this.address.name = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
        this.address.firstName = user.first_name || nameParts[0] || '';
        this.address.lastName = user.last_name || nameParts[1] || '';
        this.address.phone = user.phone || '';

        // Load existing addresses
        const customerId = user.customer_id || user.id;
        if (customerId) {
          this.addressService.getAddresses(customerId).subscribe({
            next: (res) => {
              this.savedAddresses = res.addresses || [];
              if (this.savedAddresses.length > 0) {
                // Default to the first saved address
                this.selectedAddressId = this.savedAddresses[0].address_id;
              }
            },
            error: (err) => console.error('Failed to load addresses', err)
          });
        }
      } catch {}
    }
  }

  nextStep() {
    if (this.step < 3) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  selectPayment(method: 'card' | 'qr' | 'transfer' | 'cod') {
    this.paymentMethod = method;
  }

  onSlipChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.slipFile = file;
      this.slipFileName = file.name;
    }
  }

  confirmOrder() {
    const stored = localStorage.getItem('user');
    let customerId = null;
    if (stored) {
      try {
        const user = JSON.parse(stored);
        customerId = user.customer_id || user.id;
      } catch {}
    }

    if (!customerId) {
      alert('กรุณาเข้าสู่ระบบก่อนชำระเงิน');
      return;
    }

    let finalAddress;
    if (this.selectedAddressId === 'new') {
      finalAddress = {
        name: `${this.address.firstName} ${this.address.lastName}`.trim(),
        phone: this.address.phone,
        street: this.address.street,
        province: this.address.province,
        zip: this.address.zip
      };
    } else {
      const selected = this.savedAddresses.find(a => a.address_id === this.selectedAddressId);
      finalAddress = {
        name: this.address.name || `${this.address.firstName} ${this.address.lastName}`.trim(),
        phone: this.address.phone,
        street: selected?.address_line || '',
        province: selected?.province || '',
        zip: selected?.zip_code || ''
      };
    }

    const payload = {
      customerId,
      address: finalAddress,
      paymentMethod: this.paymentMethod,
      totalAmount: this.total,
      items: this.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    this.orderService.createOrder(payload).subscribe({
      next: (res: any) => {
        this.orderId = 'ORD-' + String(res.orderId).padStart(4, '0');
        this.orderSuccess = true;
        // Refresh cart (which should now be empty)
        this.cartService.getCart(customerId).subscribe();
      },
      error: (err: any) => {
        console.error('Failed to create order', err);
        alert('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
      }
    });
  }

  close() {
    if (this.orderSuccess) {
      this.closeModal.emit();
      this.router.navigate(['/home']);
    } else {
      this.closeModal.emit();
    }
  }

  get total() {
    return this.cartService.cartTotal();
  }

  get formattedTotal() {
    return this.total.toLocaleString();
  }

  getSelectedAddress() {
    if (this.selectedAddressId === 'new') {
      return {
        name: `${this.address.firstName} ${this.address.lastName}`.trim(),
        phone: this.address.phone,
        street: this.address.street,
        province: this.address.province,
        zip: this.address.zip
      };
    } else {
      const selected = this.savedAddresses.find(a => a.address_id === this.selectedAddressId);
      return {
        name: this.address.name || `${this.address.firstName} ${this.address.lastName}`.trim(),
        phone: this.address.phone,
        street: selected?.address_line || '',
        province: selected?.province || '',
        zip: selected?.zip_code || ''
      };
    }
  }

  get items() {
    return this.cartService.cartItems();
  }
}
