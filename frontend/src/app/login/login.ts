import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.email || !this.password) {
      alert("กรุณากรอก Email และ Password");
      return;
    }

    const data = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:9999/auth/login', data)
      .subscribe({
        next: (res) => {
          console.log("LOGIN SUCCESS:", res);
          // เก็บ user ไว้ใน browser
          localStorage.setItem("user", JSON.stringify(res.user));
          localStorage.setItem("token", res.token || "login-success");
          alert('เข้าสู่ระบบสำเร็จ');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error("LOGIN ERROR:", err);
          if (err.error?.message) {
            alert(err.error.message);
          } else {
            alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
          }

        }
      });

  }

}