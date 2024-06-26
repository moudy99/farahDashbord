import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private baseUrl = `${environment.baseUrl}/Account/updateOwnerInfo`;

  constructor(private http: HttpClient) {}

  UpdateOwnerInfo(UpdateOwnerInfo: FormData): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(this.baseUrl, UpdateOwnerInfo, { headers });
  }
}
