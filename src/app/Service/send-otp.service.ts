import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SendOtpService {
  private baseUrl = `${environment.baseUrl}/Account`;

  constructor(private http: HttpClient) {}

  resendOTP(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/resendOTP`;

    return this.http.get(url, { headers });
  }

  confirmEmail(otp: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/confirmEmail?otp=${otp}`;

    return this.http.post(url, {}, { headers });
  }

  removeToken() {
    localStorage.removeItem('token');
  }
}
