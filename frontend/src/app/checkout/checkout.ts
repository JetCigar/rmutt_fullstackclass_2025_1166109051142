import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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

  step = 1; // 1=ที่อยู่, 2=วิธีชำระเงิน, 3=ยืนยัน

  // Address
  savedAddresses: AddressData[] = [];
  showNewAddressForm = false;
  selectedAddressId: any = null;
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

  // Discount
  discountCode = '';
  discountError = '';
  appliedDiscount: { id: number, code: string, amount: number } | null = null;

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private addressService: AddressService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {//ทวน
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const nameParts = user.full_name ? user.full_name.split(' ') : [];
        this.address.name = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
        this.address.firstName = user.first_name || nameParts[0] || '';
        this.address.lastName = user.last_name || nameParts[1] || '';
        this.address.phone = user.phone || '';

        this.card.holder = (this.address.firstName + ' ' + this.address.lastName).toUpperCase();

        // Load existing addresses
        const customerId = user.customer_id || user.id || user.customerId;
        
        if (customerId) {
          this.addressService.getAddresses(customerId).subscribe({
            next: (res: any) => {
              const raw = res.addresses || [];
              
              // Deduplicate by content
              const unique: AddressData[] = [];
              const seen = new Set();
              for (const a of raw) {
                const key = `${a.address_line}-${a.province}-${a.zip_code}`;
                if (!seen.has(key)) {
                  unique.push(a);
                  seen.add(key);
                } else if (a.is_default) {
                  const idx = unique.findIndex(u => `${u.address_line}-${u.province}-${u.zip_code}` === key);
                  if (idx !== -1) unique[idx] = a;
                }
              }
              this.savedAddresses = unique;
              
              this.showNewAddressForm = false;

              if (this.savedAddresses.length > 0) {
                this.savedAddresses.sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
                this.selectedAddressId = this.savedAddresses[0].address_id;
              } else {
                this.selectedAddressId = null;
                this.showNewAddressForm = true; // Fallback to form if no addresses
              }
              this.cdr.detectChanges(); 
            },
            error: (err) => {
              console.error('Failed to load addresses', err);
              this.showNewAddressForm = true;
              this.cdr.detectChanges();
            }
          });
        }
      } catch {}
    }
  }

  nextStep() {
    if (this.step === 1) {
      if (!this.selectedAddressId && !this.showNewAddressForm) {
        alert('กรุณาเลือกหรือเพิ่มที่อยู่จัดส่ง');
        return;
      }
      
      if (this.showNewAddressForm) {
        if (!this.address.firstName || !this.address.street || !this.address.province || !this.address.zip) {
          alert('กรุณากรอกข้อมูลที่อยู่ใหม่ให้ครบถ้วน');
          return;
        }
      }
    }
    
    if (this.step === 2) {
      if (!this.paymentMethod) {
        alert('กรุณาเลือกวิธีการชำระเงิน');
        return;
      }
      if (this.paymentMethod === 'card') {
        if (!this.card.number || !this.card.expiry || !this.card.cvv) {
          alert('กรุณากรอกข้อมูลบัตรให้ครบถ้วน');
          return;
        }
      }
    }
    
    if (this.step < 3) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  cancelNewAddress() {
    this.showNewAddressForm = false;
    if (this.savedAddresses.length > 0) {
      this.selectedAddressId = this.savedAddresses[0].address_id;
    }
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
    if (this.showNewAddressForm) {
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
        name: this.getAddressNameDisplay(selected),
        phone: this.getAddressPhoneDisplay(selected),
        street: this.getAddressStreetDisplay(selected),
        province: selected?.province || '',
        zip: selected?.zip_code || ''
      };
    }

    const payload = {
      customerId,
      addressId: this.showNewAddressForm ? null : this.selectedAddressId,
      address: finalAddress,
      paymentMethod: this.paymentMethod,
      totalAmount: this.total,
      discountId: this.appliedDiscount ? this.appliedDiscount.id : null,
      items: this.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    console.log('FRONTEND: Sending order payload with addressId:', payload.addressId);

    this.orderService.createOrder(payload).subscribe({
      next: (res: any) => {
        this.orderId = 'ORD-' + String(res.orderId).padStart(4, '0');
        this.orderSuccess = true;

        // ลบสินค้าที่ชำระแล้วออกจาก backend และ cart signal
        const paidItems = this.items; // selected items ที่เพิ่งสั่ง
        paidItems.forEach((item: any) => {
          this.cartService.removeItem(item.cart_item_id).subscribe();
        });

        // อัปเดต signal ทันที — เหลือแต่สินค้าที่ไม่ได้เลือก
        const remaining = this.cartService.cartItems().filter(
          (item: any) => !item.selected
        );
        this.cartService.cartItems.set(remaining);
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
      this.router.navigate(['/order']);
    } else {
      this.closeModal.emit();
    }
  }

  getAddressNameDisplay(addr: any) {
    if (addr?.address_line && addr.address_line.includes('|')) {
      const parts = addr.address_line.split('|');
      return parts[0].replace(/\d{2,}-\d{3,}-\d{4,}/, '').trim() || this.address.name;
    }
    return this.address.name;
  }

  getAddressStreetDisplay(addr: any) {
    if (addr?.address_line && addr.address_line.includes('|')) {
      const parts = addr.address_line.split('|');
      return parts[1].trim();
    }
    return addr?.address_line || '';
  }

  getAddressPhoneDisplay(addr: any) {
    if (addr?.phone) return addr.phone;
    if (addr?.address_line && addr.address_line.includes('|')) {
      const parts = addr.address_line.split('|');
      const phoneMatch = parts[0].match(/\d{2,}-\d{3,}-\d{4,}/);
      return phoneMatch ? phoneMatch[0] : this.address.phone;
    }
    return this.address.phone;
  }

  get total() {
    let base = this.items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
    if (this.appliedDiscount) {
      base -= this.appliedDiscount.amount;
      if (base < 0) base = 0;
    }
    return base;
  }

  get formattedTotal() {
    return this.total.toLocaleString();
  }

  applyDiscount() {
    if (!this.discountCode.trim()) {
      this.discountError = 'กรุณากรอกโค้ดส่วนลด';
      return;
    }
    this.discountError = '';
    this.orderService.validateDiscount(this.discountCode).subscribe({
      next: (res: any) => {
        this.appliedDiscount = {
          id: res.discount_id,
          code: res.code,
          amount: Number(res.discount_amount)
        };
      },
      error: (err: any) => {
        this.appliedDiscount = null;
        this.discountError = err.error?.message || 'โค้ดส่วนลดไม่ถูกต้อง หรือหมดอายุ';
      }
    });
  }

  getSelectedAddress() {
    if (this.showNewAddressForm) {
      return {
        name: `${this.address.firstName} ${this.address.lastName}`.trim(),
        phone: this.address.phone,
        street: this.address.street,
        province: this.address.province,
        zip: this.address.zip
      };
    } else {
      const selected = this.savedAddresses.find(a => a.address_id === this.selectedAddressId);
      if (!selected) {
        return { name: this.address.name, phone: this.address.phone, street: '', province: '', zip: '' };
      }
      return {
        name: this.getAddressNameDisplay(selected),
        phone: this.getAddressPhoneDisplay(selected),
        street: this.getAddressStreetDisplay(selected),
        province: selected.province || '',
        zip: selected.zip_code || ''
      };
    }
  }

  get items() {
    return this.cartService.cartItems().filter((item: any) => item.selected);
  }
}
