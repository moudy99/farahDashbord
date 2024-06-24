import { Customer } from './../Interfaces/customer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GetUsersService {
  constructor(private http: HttpClient) {}

  toggleBlockStatus(
    ownerId: string,
    action: 'block' | 'unblock'
  ): Observable<any> {
    const url = `${environment.baseUrl}/Admin/${action}Owner`;
    const params = { ownerId };

    const queryParams = new HttpParams().set('ownerId', ownerId);

    return this.http.put(url, null, { params: queryParams });
  }

  toggleBlockCustomer(
    CustomerId: string,
    action: 'block' | 'unblock'
  ): Observable<any> {
    const url = `${environment.baseUrl}/Admin/${action}Customer`;
    const params = { CustomerId };

    const queryParams = new HttpParams().set('customerId', CustomerId);

    return this.http.put(url, null, { params: queryParams });
  }

  getAllOwners(
    page: number,
    pageSize: number,
    accountStatus: number | null,
    isBlocked: boolean | null
  ): Observable<any> {
    const url = `${environment.baseUrl}/Admin/owners`;
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      status: accountStatus ? accountStatus.toString() : '',
      isBlocked: isBlocked ? isBlocked.toString() : '',
    };

    return this.http.get(url, { params });
  }

  getAllCustomers(
    page: number,
    pageSize: number,
    isBlocked: boolean | null
  ): Observable<any> {
    const url = `${environment.baseUrl}/Admin/Customers`;
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      isBlocked: isBlocked ? isBlocked.toString() : '',
    };

    return this.http.get(url, { params });
  }
}
