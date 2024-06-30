import { ServiceStatusEnum } from './../enums/service-status-enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GetServicesService {
  constructor(private http: HttpClient) {}

  getAllOwnerServices(): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}/Account/OwnerServices`;
    return this.http.get(url, { headers });
  }

  getAllServices(
    ServiceStatus: ServiceStatusEnum,
    Page: number,
    pageSize: number
  ) {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}/Admin/Services?ServiceStatus=${ServiceStatus}&page=${Page}&pageSize=${pageSize}`;
    return this.http.get(url, { headers });
  }
}
