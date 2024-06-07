import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = 'https://localhost:7044/academy-api/login';
  checklogin = false;
  res: any;
  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(this.baseUrl, data, { observe: 'response' });
  }
  getStatus(response: HttpResponse<any>): number {
    this.res = response.status;
    if (this.res === 200) {
      // Check the status code
      this.checklogin = true;
      localStorage.setItem('checklogin', `${this.checklogin}`);
      console.log('Logged in successfully');
    }
    return this.res;
  }

  checkUserLogin() {
    return localStorage.getItem('checklogin');
  }

  getUsername(data: any) {
    return this.http.post(this.baseUrl, data);
  }
}

// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoginService {
//   baseURL='https://localhost:7044/academy-api/login';
//   constructor(private http:HttpClient) { }

//   getUsername(data:any){
//       return this.http.post(this.baseURL,data);
//   }
// }
