import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class ServicesManagementService {
  token = localStorage.getItem('token') || sessionStorage.getItem('token');
  constructor(private http: HttpClient) {}

  ///Removing Methods
  // RemoveBeautyCenter(id: number): Observable<any> {
  //   const url = `${environment.baseUrl}/BeautyCenter?id=${id}`;
  //   return this.http.delete(url);
  // }

  // RemoveCar(id: number): Observable<any> {
  //   const url = `${environment.baseUrl}/Car?id=${id}`;
  //   return this.http.delete(url);
  // }

  // RemoveHall(id: number): Observable<any> {
  //   const url = `${environment.baseUrl}/Hall?id=${id}`;
  //   return this.http.delete(url);
  // }

  // RemovePhotography(id: number): Observable<any> {
  //   const url = `${environment.baseUrl}/Photography?id=${id}`;
  //   return this.http.delete(url);
  // }
  // RemoveShopDress(id: number): Observable<any> {
  //   const url = `${environment.baseUrl}/ShopDresses?id=${id}`;
  //   return this.http.delete(url);
  // }

  ///Removing Methods
  RemoveService(serviceType: string, id: number): Observable<any> {
    const url = `${environment.baseUrl}/${serviceType}?id=${id}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    return this.http.delete(url, { headers });
  }
}
