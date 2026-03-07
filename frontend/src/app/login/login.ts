import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = "";
  password = "";
  showPassword = false;

  constructor(private http: HttpClient) {}

  togglePassword(){
    this.showPassword = !this.showPassword;
  }

  login(){

    if(!this.email || !this.password){
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    this.http.post("http://localhost:3000/api/auth/login",{
      email: this.email,
      password: this.password
    }).subscribe({

      next:(res:any)=>{
        alert("เข้าสู่ระบบสำเร็จ");
        console.log(res);
      },

      error:(err)=>{
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        console.log(err);
      }

    });

  }

}