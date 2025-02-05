import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private baseUrl = `${environment.baseUrl}/Car/AddCar`;
  private apiUrlUp = `${environment.baseUrl}/Car/`;

  constructor(private http: HttpClient) {}

  addCarService(carData: FormData): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.baseUrl, carData, { headers });
  }
  UpdateCar(id: string | null,carData: FormData): Observable<any> {
    const token =
    localStorage.getItem('token') || sessionStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const url = id ? `${this.apiUrlUp}${id}` : this.apiUrlUp;

  return this.http.put(url, carData, { headers });
  }
}
