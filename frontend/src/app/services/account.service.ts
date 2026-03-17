import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface ProfileData {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiBase = 'http://localhost:9999/auth';
  private profileUpdatedSource = new Subject<ProfileData>();
  profileUpdated$ = this.profileUpdatedSource.asObservable();

  constructor(private http: HttpClient) {}

  getProfile(customerId: number): Observable<{ user: ProfileData }> {
    return this.http.get<{ user: ProfileData }>(`${this.apiBase}/settings/${customerId}`);
  }

  updateProfile(
    customerId: number,
    payload: UpdateProfilePayload
  ): Observable<{ user: ProfileData; message?: string }> {
    return this.http.put<{ user: ProfileData; message?: string }>(
      `${this.apiBase}/settings/${customerId}`,
      payload
    );
  }

  notifyProfileUpdate(profile: ProfileData) {
    this.profileUpdatedSource.next(profile);
  }
}
