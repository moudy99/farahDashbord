import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Governorate } from '../Interfaces/governorate';
import { City } from '../Interfaces/city';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getGovernorates(): Observable<Governorate[]> {
    return this.http.get<Governorate[]>(`${this.baseUrl}/Governorate`);
  }

  getGovernorateByID(govId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Governorate/${govId}`);
  }
  getCityByID(cityID: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/City/getCityById?id=${cityID}`);
  }
  getCitiesByGovId(governorateID: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/City/${governorateID}`);
  }
}
