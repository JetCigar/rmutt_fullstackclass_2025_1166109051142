import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, HttpClientModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  firstname = '';
  lastname = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;
  showPassword = false;
  showConfirmPassword = false;
  hasUpperLower = false;
  hasMinLength = false;
  hasSpecial = false;
  passwordMismatch = false;
  showTerms = false;
  showPrivacy = false;

  openTerms() {
    this.showTerms = true;
  }

  openPrivacy() {
    this.showPrivacy = true;
  }

  closePopup() {
    this.showTerms = false;
    this.showPrivacy = false;
  }
  constructor(private http: HttpClient, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

 checkPassword() {

  this.hasUpperLower =
    /[a-z]/.test(this.password) && /[A-Z]/.test(this.password);

  this.hasMinLength =
    this.password.length >= 6;

  this.hasSpecial =
    /[!@#$%^&*(),.?":{}|<>]/.test(this.password);

}

  checkConfirmPassword() {
    this.passwordMismatch = this.password !== this.confirmPassword;
  }
  register() {

    if (!this.firstname || !this.lastname || !this.email || !this.password) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (!this.acceptTerms) {
      alert('กรุณายอมรับข้อกำหนด');
      return;
    }

    if (!(this.hasUpperLower && this.hasMinLength && this.hasSpecial)) {
      alert('รหัสผ่านไม่ตรงเงื่อนไข');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      return;
    }

    const data = {
      first_name: this.firstname,
      last_name: this.lastname,
      email: this.email,
      phone: this.phone,
      password: this.password
    };

   this.http.post<any>('http://localhost:9999/auth/register', data)
      .subscribe({
        next: () => {

          alert('สมัครสมาชิกสำเร็จ');

          this.router.navigate(['/login']);

        },
        error: (err) => {

          console.error(err);

          if (err.error?.message) {
            alert(err.error.message);
          } else {
            alert('สมัครสมาชิกไม่สำเร็จ');
          }

        }
      });

  }

}