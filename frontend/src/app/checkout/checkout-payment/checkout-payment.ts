import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

export type PaymentMethod = 'credit' | 'qr' | 'transfer' | 'cod';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-payment.html',
  styleUrls: ['./checkout-payment.scss']
})
export class CheckoutPayment implements OnInit {

  @Output() closeModal = new EventEmitter<void>();

  addressId: number | null = null;

  // วิธีชำระเงิน
  selectedMethod: PaymentMethod = 'credit';

  // บัตรเครดิต
  cardNumber = '';
  cardCvv = '';
  cardName = '';
  expiryMonth = '';
  expiryYear = '';

  readonly expiryMonths = [
    { value: '01', label: '01 - มกราคม' },
    { value: '02', label: '02 - กุมภาพันธ์' },
    { value: '03', label: '03 - มีนาคม' },
    { value: '04', label: '04 - เมษายน' },
    { value: '05', label: '05 - พฤษภาคม' },
    { value: '06', label: '06 - มิถุนายน' },
    { value: '07', label: '07 - กรกฎาคม' },
    { value: '08', label: '08 - สิงหาคม' },
    { value: '09', label: '09 - กันยายน' },
    { value: '10', label: '10 - ตุลาคม' },
    { value: '11', label: '11 - พฤศจิกายน' },
    { value: '12', label: '12 - ธันวาคม' },
  ];

  readonly expiryYears: number[] = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() + i
  );

  // โอนเงิน
  transferDate = '';
  todayStr = new Date().toISOString().split('T')[0];

  // สลิป (ใช้ร่วมกันทั้ง QR และ โอนเงิน)
  slipFile: File | null = null;
  slipPreview: string | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.addressId = params['addressId'] ? +params['addressId'] : null;
    });
  }

  selectMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
    this.errorMessage = '';
    this.slipFile = null;
    this.slipPreview = null;
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '').substring(0, 16);
    this.cardNumber = value.replace(/(.{4})/g, '$1 ').trim();
  }

  onSlipSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) this.loadSlip(file);
  }

  onSlipDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.loadSlip(file);
  }

  loadSlip(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'ขนาดไฟล์ต้องไม่เกิน 5MB';
      return;
    }
    this.slipFile = file;
    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = (e) => {
      this.slipPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeSlip(event: Event): void {
    event.stopPropagation();
    this.slipFile = null;
    this.slipPreview = null;
  }

  validate(): boolean {
    this.errorMessage = '';

    if (this.selectedMethod === 'credit') {
      const rawCard = this.cardNumber.replace(/\s/g, '');
      if (rawCard.length !== 16) {
        this.errorMessage = 'กรุณากรอกหมายเลขบัตร 16 หลัก';
        return false;
      }
      if (!this.expiryMonth || !this.expiryYear) {
        this.errorMessage = 'กรุณาเลือกเดือนและปีหมดอายุ';
        return false;
      }
      if (this.cardCvv.length !== 3) {
        this.errorMessage = 'กรุณากรอก CVV 3 หลัก';
        return false;
      }
      if (!this.cardName.trim()) {
        this.errorMessage = 'กรุณากรอกชื่อบนบัตร';
        return false;
      }
    }

    if (this.selectedMethod === 'qr') {
      if (!this.slipFile) {
        this.errorMessage = 'กรุณาแนบสลิปยืนยันการชำระ';
        return false;
      }
    }

    if (this.selectedMethod === 'transfer') {
      if (!this.transferDate) {
        this.errorMessage = 'กรุณาเลือกวันที่โอนเงิน';
        return false;
      }
      if (!this.slipFile) {
        this.errorMessage = 'กรุณาแนบสลิปการโอนเงิน';
        return false;
      }
    }

    return true;
  }

  onNext(): void {
    if (!this.validate()) return;
    this.router.navigate(['/checkout-confirm'], {
      queryParams: { addressId: this.addressId, method: this.selectedMethod }
    });
  }

  onBack(): void {
    this.router.navigate(['/checkout-address']);
  }

  onClose(): void {
    this.closeModal.emit();
    this.router.navigate(['/']);
  }
}