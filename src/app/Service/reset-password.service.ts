import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private apiUrl = `${environment.baseUrl}/Account`;

  constructor(private http: HttpClient) {}

  forgetPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/forgetPassword?Email=${email}`;
    return this.http.post<any>(url, null);
  }

  changePassword(
    oldPassword: string,
    newPassword: string,
    securityQuestionAnswer: string
  ): Observable<any> {
    const url = `${this.apiUrl}/changePassword`;
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage or sessionStorage');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const body = {
      oldPassword,
      newPassword,
      securityQuestionAnswer,
    };
    return this.http.post<any>(url, body, { headers });
  }
}
