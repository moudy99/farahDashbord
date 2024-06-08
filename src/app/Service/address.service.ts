import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Governorate } from '../Interfaces/governorate';
import { City } from '../Interfaces/city';
@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private baseUrl = 'https://localhost:44322/api';

  constructor(private http: HttpClient) {}

  getGovernorates(): Observable<Governorate[]> {
    return this.http.get<Governorate[]>(`${this.baseUrl}/Governorate`);
  }

  getCitiesByGovId(governorateID: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/City/${governorateID}`);
  }
}
