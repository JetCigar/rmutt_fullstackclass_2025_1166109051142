import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Address {
  address_id: number;
  address_line: string;
  province: string;
  zip_code: string;
  is_default: boolean;
}

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-address.html',
  styleUrls: ['./checkout-address.scss']
})
export class CheckoutAddress implements OnInit {

  @Output() closeModal = new EventEmitter<void>();

  addresses: Address[] = [];
  selectedAddressId: number | null = null;
  customerName: string = '';

  // new address
  showNewAddressForm = false;
  newAddressLine = '';
  newProvince = '';
  newZipCode = '';

  // edit address
  editingAddress: Address | null = null;
  editAddressLine = '';
  editProvince = '';
  editZipCode = '';

  isLoading = false;
  errorMessage = '';

  readonly provinces: string[] = [
    'กรุงเทพมหานคร','กระบี่','กาญจนบุรี','กาฬสินธุ์','กำแพงเพชร',
    'ขอนแก่น','จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ชัยนาท',
    'ชัยภูมิ','ชุมพร','เชียงราย','เชียงใหม่','ตรัง',
    'ตราด','ตาก','นครนายก','นครปฐม','นครพนม',
    'นครราชสีมา','นครศรีธรรมราช','นครสวรรค์','นนทบุรี','นราธิวาส',
    'น่าน','บึงกาฬ','บุรีรัมย์','ปทุมธานี','ประจวบคีรีขันธ์',
    'ปราจีนบุรี','ปัตตานี','พระนครศรีอยุธยา','พะเยา','พังงา',
    'พัทลุง','พิจิตร','พิษณุโลก','เพชรบุรี','เพชรบูรณ์',
    'แพร่','ภูเก็ต','มหาสารคาม','มุกดาหาร','แม่ฮ่องสอน',
    'ยโสธร','ยะลา','ร้อยเอ็ด','ระนอง','ระยอง',
    'ราชบุรี','ลพบุรี','ลำปาง','ลำพูน','เลย',
    'ศรีสะเกษ','สกลนคร','สงขลา','สตูล','สมุทรปราการ',
    'สมุทรสงคราม','สมุทรสาคร','สระแก้ว','สระบุรี','สิงห์บุรี',
    'สุโขทัย','สุพรรณบุรี','สุราษฎร์ธานี','สุรินทร์','หนองคาย',
    'หนองบัวลำภู','อ่างทอง','อำนาจเจริญ','อุดรธานี','อุตรดิตถ์',
    'อุทัยธานี','อุบลราชธานี'
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  // โหลดที่อยู่จาก API
  loadAddresses(): void {

    this.isLoading = true;

    this.http.get<any>('http://localhost:9999/api/addresses')
    .subscribe({

      next: (res:any) => {

        this.customerName = res.customerName;
        this.addresses = res.addresses;

        const defaultAddr = this.addresses.find(a => a.is_default);

        if (defaultAddr) {
          this.selectedAddressId = defaultAddr.address_id;
        }

        this.isLoading = false;

      },

      error: () => {

        this.errorMessage = 'โหลดที่อยู่ไม่สำเร็จ';
        this.isLoading = false;

      }

    });
  }

  // เลือกที่อยู่
  selectAddress(id: number): void {
    this.selectedAddressId = id;
  }

  // เปิด/ปิดฟอร์มเพิ่มที่อยู่
  toggleNewAddressForm(): void {

    this.showNewAddressForm = !this.showNewAddressForm;

    if (!this.showNewAddressForm) {
      this.newAddressLine = '';
      this.newProvince = '';
      this.newZipCode = '';
    }

  }

  // เริ่มแก้ไข
  startEdit(address: Address, event: Event): void {

    event.stopPropagation();

    this.editingAddress = address;
    this.editAddressLine = address.address_line;
    this.editProvince = address.province;
    this.editZipCode = address.zip_code;

  }

  // ยกเลิกแก้ไข
  cancelEdit(): void {
    this.editingAddress = null;
  }

  // บันทึกการแก้ไข
  saveEdit(): void {

    if (!this.editingAddress) return;

    const body = {
      address_line: this.editAddressLine,
      province: this.editProvince,
      zip_code: this.editZipCode
    };

    this.http.put(`http://localhost:9999/api/addresses/${this.editingAddress.address_id}`, body)
    .subscribe({

      next: () => {

        const addr = this.addresses.find(a => a.address_id === this.editingAddress!.address_id);

        if (addr) {
          addr.address_line = this.editAddressLine;
          addr.province = this.editProvince;
          addr.zip_code = this.editZipCode;
        }

        this.editingAddress = null;

      },

      error: () => {
        this.errorMessage = 'แก้ไขที่อยู่ไม่สำเร็จ';
      }

    });

  }

  // เพิ่มที่อยู่ใหม่
  createAddress(): void {

    this.errorMessage = '';
  
    const address_line = this.newAddressLine.trim();
    const province = this.newProvince.trim();
    const zip_code = this.newZipCode.trim();
  
    if (!address_line || !province || !zip_code) {
      this.errorMessage = "กรุณากรอกข้อมูลให้ครบ";
      return;
    }
  
    if (zip_code.length !== 5) {
      this.errorMessage = "รหัสไปรษณีย์ต้องมี 5 หลัก";
      return;
    }
  
    const body = {
      address_line,
      province,
      zip_code
    };
  
    this.isLoading = true;
  
    this.http.post<Address>('http://localhost:9999/api/addresses', body)
    .subscribe({
  
      next: (res:any) => {
  
        this.addresses.push(res);
  
        this.selectedAddressId = res.address_id;
  
        this.newAddressLine = '';
        this.newProvince = '';
        this.newZipCode = '';
  
        this.showNewAddressForm = false;
  
        this.isLoading = false;
  
      },
  
      error: () => {
  
        this.errorMessage = "เพิ่มที่อยู่ไม่สำเร็จ";
        this.isLoading = false;
  
      }
  
    });
  
  }

  // ลบที่อยู่
  deleteAddress(id: number, event: Event): void {

    event.stopPropagation();

    if (!confirm("ต้องการลบที่อยู่นี้?")) return;

    this.http.delete(`http://localhost:9999/api/addresses/${id}`)
    .subscribe({

      next: () => {

        this.addresses = this.addresses.filter(a => a.address_id !== id);

        if (this.selectedAddressId === id) {

          const defaultAddr = this.addresses.find(a => a.is_default);
          this.selectedAddressId = defaultAddr?.address_id ?? null;

        }

      },

      error: () => {
        this.errorMessage = "ลบที่อยู่ไม่สำเร็จ";
      }

    });

  }

  // ไปหน้า payment
  onNext(): void {

    if (!this.selectedAddressId) {

      this.errorMessage = "กรุณาเลือกที่อยู่จัดส่ง";
      return;

    }

    this.router.navigate(['/checkout/payment'], {
      queryParams: {
        addressId: this.selectedAddressId
      }
    });

  }

  // ปิด modal
  onClose(): void {
    this.closeModal.emit();
  }

}