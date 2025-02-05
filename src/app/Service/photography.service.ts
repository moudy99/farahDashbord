import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PhotographyService {
  private baseUrl = `${environment.baseUrl}/Photography/`;

  constructor(private http: HttpClient) {}

  addPhotographerService(photographerData: FormData): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.baseUrl, photographerData, { headers });
  }
  updatePhotographerService(id: string | null,photographerData: FormData): Observable<any> {
    const token =
    localStorage.getItem('token') || sessionStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const url = id ? `${this.baseUrl}${id}` : this.baseUrl;
  return this.http.put(url, photographerData, { headers });
  }
}
