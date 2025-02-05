import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HallService {
  private apiUrl = `${environment.baseUrl}/Hall/AddHall`;
  private apiUrlUp = `${environment.baseUrl}/Hall`;
  

  constructor(private http: HttpClient) {}

  addHall(formData: FormData): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, formData, { headers });
  }
  updateHall(id: string | null, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = id ? `${this.apiUrlUp}/${id}` : this.apiUrlUp; // Ensure there's a slash before the id
  
    return this.http.put(url, formData, { headers });
  }
  
  
 
  
}
