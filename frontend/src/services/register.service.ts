import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:9999/api/register';

  constructor(private http: HttpClient) {}

  // REGISTER
  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // LOGIN
  login(data: any): Observable<any> { //เรียกใช้API
    return this.http.post(`${this.apiUrl}/login`, data);
  }

}