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

  RemoveService(serviceType: string, id: number): Observable<any> {
    const url = `${environment.baseUrl}/${serviceType}?id=${id}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    return this.http.delete(url, { headers });
  }
}
