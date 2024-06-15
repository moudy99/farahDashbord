import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
