import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BeautyCenterService {
  private apiUrl = `${environment.baseUrl}/BeautyCenter`;

  constructor(private http: HttpClient) {}

  addBeautyCenter(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, formData, { headers });
  }

  addBeautyServices(servicesData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.post(`${this.apiUrl}/AddBeautyService`, servicesData, {
      headers,
    });
  }
}
