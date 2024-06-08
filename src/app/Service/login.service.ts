import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = 'https://localhost:44322/api/Account/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const data = { email, password };
    return this.http.post(this.baseUrl, data, { observe: 'response' });
  }
}
